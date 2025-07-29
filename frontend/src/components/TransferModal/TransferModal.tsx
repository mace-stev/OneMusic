import { FormEvent } from "react";
import "./TransferModal.css"
import { useState, useEffect } from "react";
import { thunkCreatePlaylist, thunkGetAllPlaylists } from "../../redux/playlist";
import { useDispatch } from "react-redux";
import { useModal } from '../../context/Modal';
import { thunkCreateImage } from "../../redux/image";
import { thunkCreateSong } from "../../redux/song";
import { IImage } from "../../redux/types/image";
import { ISong } from "../../redux/types/song";
import { OAuthParams, YoutubePlaylists, cleanYoutubePlaylists, FilteredYoutubeSong, YoutubeVideos, UpdatedFilteredYoutubeSong } from "../../../types/youtube"
import processYoutubeSongs from "../../../utils"
import { csrfFetch } from "../../redux/csrf";
import { createOAuthForm, oauth2SignIn } from "../../../utils/YTAuth"
import { spotifySignIn } from "../../../utils/SpotifyAuth";
import { spotifyPlaylist, SpotifyPlaylistResource, SpotifyPlaylistItem, FilteredSpotifyTrack, SpotifyPlaylistItems, SpotifyPlaylistTrack, SpotifyPlaylistArtist } from "../../../types/spotify"


function TransferModal() {
  const [store, setStore] = useState<OAuthParams>(JSON.parse(localStorage.getItem('oauth2-test-params') || '{}'));
  const [playlists, setPlaylists] = useState<cleanYoutubePlaylists[]>()
  const [playlistName, setPlaylistName] = useState<string>("")
  const [playlistURL, setPlaylistURL] = useState<string>("")
  const [playlistId, setPlaylistId] = useState<string>("")
  const [nextPageToken, setNextPageToken] = useState<string>("")
  const [imageId, setImageId] = useState<number>()
  const [songs, setSongs] = useState<UpdatedFilteredYoutubeSong[]>([])
  const [onSubmitIsDone, setOnSubmitIsDone] = useState<boolean>(false)
  const [onSubmitClicked, setOnSubmitClicked] = useState<boolean>(false)
  const [spotifyOnSubmitClicked, setSpotifyOnSubmitClicked] = useState<boolean>(false)
  const [spotifyClicked, setSpotifyClicked] = useState<boolean>(false)
  const [spotifyPlaylists, setSpotifyPlaylists] = useState<spotifyPlaylist[]>([])
  const [createdPlaylistId, setCreatedPlaylistId] = useState<number>()
  const dispatch = useDispatch()
  const { closeModal } = useModal()
  const [youtubeClicked, setYoutubeClicked] = useState<boolean>(false)
  const [loading, setLoading] = useState<string>("Please Wait...")
  
  const [spotifyAccessCode, setSpotifyAccessCode] = useState<string>("")
  const [spotifyPlaylistUrl, setSpotifyPlaylistUrl] = useState<spotifyPlaylist[`href`]>()
  const [spotifyPlaylistName, setSpotifyPlaylistName] = useState<spotifyPlaylist[`name`]>()
  const [spotifyPlaylistImage, setSpotifyPlaylistImage] = useState<spotifyPlaylist[`image`]>()
  







  async function onSubmitSpotify(event: FormEvent) {
    event.preventDefault()
    setOnSubmitClicked(true)
    try {
      const accessToken = localStorage.getItem('spotify_access_token')
      const playlistSongs: FilteredSpotifyTrack[] = [];
      const result = await fetch(`${spotifyPlaylistUrl}?limit=50`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }

      )
      const resultData = await result.json()
      console.log(resultData)
      let playlistImage = resultData.images[0].url
      if (!playlistImage) {
        playlistImage = "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-blank-avatar-modern-vector-png-image_40962406.jpg";
      }
      const createPlaylistImage = await dispatch(thunkCreateImage({ url: playlistImage }))
      const createPlaylist = await dispatch(thunkCreatePlaylist({ name: resultData.name, previewId: createPlaylistImage.id }))
      const tracksUrl = resultData.tracks.href
      const playlistSongsCall = await fetch(`${tracksUrl}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })


      const playlistSongsData = (await playlistSongsCall.json()) as SpotifyPlaylistItems;
      for (const element of playlistSongsData?.items) {
        let songImage = element.track.preview_url
        if (!songImage) {
          songImage = "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-blank-avatar-modern-vector-png-image_40962406.jpg";
        }
        const createSongImage = await dispatch(thunkCreateImage({ url: songImage }))

        playlistSongs.push({ title: element.track.name, artist: element.track.artists[0].name, previewId: createSongImage.id })
      }



      let nextPage = playlistSongsData.next
      while (nextPage) {
        const playlistSongsCall = await fetch(`${nextPage}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })


        const playlistSongsData = (await playlistSongsCall.json()) as SpotifyPlaylistItems;
        for (const element of playlistSongsData?.items) {
          let songImage = element.track.preview_url
          if (!songImage) {
            songImage = "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-blank-avatar-modern-vector-png-image_40962406.jpg";
          }
          const createSongImage = await dispatch(thunkCreateImage({ url: songImage }))

          playlistSongs.push({ title: element.track.name, artist: element.track.artists[0].name, previewId: createSongImage.id })
        }
        nextPage = playlistSongsData.next
      }
    
      for (const element of playlistSongs) {
        const song = await dispatch(thunkCreateSong({ title: element.title, artist: element.artist, previewId: Number(element.previewId) }))
        element.id = song.id
      }
      for (const [index, element] of playlistSongs.entries()) {
        let percentage = (((index + 1) * 100) / playlistSongs.length).toFixed(1)
        setLoading(`${percentage}%`)
        const response = await csrfFetch(
          `/api/playlist/${createPlaylist.id}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ songId: element?.id }),
          }
        );
        if (!response.ok) {
          const err = await response.json();
          throw new Error(`${response.status} ${response.statusText}: ${err.error?.message}`);
        }
      }
      closeModal();
    } catch (err) {
      console.log(err)
    }

  }
  useEffect(() => {
    async function spotifyCall() {
      try {
        const fetchedPlaylists: spotifyPlaylist[] = []
        const accessToken = localStorage.getItem('spotify_access_token')
        const result = await fetch("https://api.spotify.com/v1/me/playlists", {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        if (result.status === 401) {
          spotifySignIn()
        }
        if (!result.ok) {
          const err = await result.json()
          console.log(err)
          throw new Error(`${result.status} ${result.statusText}: ${err.error?.message}`);
        }
        const resultData = await result.json()
        for (const element of resultData.items) {
          let image = ""
          if (element.images) {
            image = element.images[0]
          }

          fetchedPlaylists.push({ href: element.href, name: element.name, image: image })
        }
        setSpotifyPlaylists(fetchedPlaylists)
      } catch (err) {
        console.log(err)
      }

    }


    if (spotifyClicked === true) {
      spotifyCall()
    }



  }, [spotifyClicked])



  ///////////////On form submit, a user's playlist and all of that playlists items are fetched from youtube and the data is then organized.
  async function onSubmitYoutube(event: FormEvent) {
    event.preventDefault();
    setOnSubmitClicked(true)
    if (playlistURL === "") {
      const undefinedImageUrl =
        "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-blank-avatar-modern-vector-png-image_40962406.jpg";
      const imageResponse = await dispatch(thunkCreateImage({ url: undefinedImageUrl }));
      setImageId(imageResponse.id);
      return;
    }

    const imageResponse = await dispatch(thunkCreateImage({ url: playlistURL }));
    setImageId(imageResponse.id);

    try {
      const songArray: FilteredYoutubeSong[] = [];

      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50`,
        {
          headers: {
            Authorization: `Bearer ${store.access_token}`,
            Accept: "application/json",
          },
        }
      );
    


      const pageData = await res.json();

      for (const element of pageData.items as YoutubeVideos[]) {
        const songImage = await new Promise<{ id: string }>((resolve, reject) => {
          let image = element.snippet.thumbnails.default?.url
          if (!image) {
            image = "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-blank-avatar-modern-vector-png-image_40962406.jpg";
          }
          dispatch(thunkCreateImage({ url: image }))
            .then((img: IImage) => {
              if (img?.id) resolve({ id: img.id.toString() });
              else reject(new Error("Image ID is undefined"));
            })
            .catch(reject);
        });

        songArray.push({
          ytId: element.id,
          description: element.snippet.description,
          thumbnails: {
            default: {
              url: element.snippet.thumbnails.default?.url,
              width: element.snippet.thumbnails.default?.width,
              height: element.snippet.thumbnails.default?.height,
            },
          },
          title: element.snippet.title,
          videoOwnerChannelTitle: element.snippet.videoOwnerChannelTitle,
          imageId: songImage.id,
        });
      }

      let token = pageData.nextPageToken;

      while (token) {
        const result = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&pageToken=${token}`,
          {
            headers: {
              Authorization: `Bearer ${store.access_token}`,
              Accept: "application/json",
            },
          }
        );

        const pageData = await result.json();

        for (const element of pageData.items as YoutubeVideos[]) {

          const songImage = await new Promise<{ id: string }>((resolve, reject) => {
            let image = element.snippet.thumbnails.default?.url
            if (!image) {
              image = "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-blank-avatar-modern-vector-png-image_40962406.jpg";
            }
            dispatch(thunkCreateImage({ url: image }))
              .then((img: IImage) => {
                if (img?.id) resolve({ id: img.id.toString() });
                else reject(new Error("Image ID is undefined"));
              })
              .catch(reject);
          });

          songArray.push({
            ytId: element.id,
            description: element.snippet.description,
            thumbnails: {
              default: {
                url: element.snippet.thumbnails.default?.url,
                width: element.snippet.thumbnails.default?.width,
                height: element.snippet.thumbnails.default?.height,
              },
            },
            title: element.snippet.title,
            videoOwnerChannelTitle: element.snippet.videoOwnerChannelTitle,
            imageId: songImage.id,
          });
        }

        token = pageData.nextPageToken;
      }
      const newSongs = processYoutubeSongs(songArray)
      setSongs(newSongs);
      setOnSubmitIsDone(true)

    } catch (error) {
      console.log(error);
    }
  }



  /////////useEffect that creates a playlist and adds songs to the database after its preview image is created   
  useEffect(() => {
    async function createPlaylistAndSongs() {
      const copy = songs.filter((element) => {
        if (element.title !== "Deleted video" && element.songArtist !== '' && element.songTitle !== '') {
          return element
        }
      })
      for (const element of copy) {
        if (element.title !== "Deleted video" && element.songArtist !== '' && element.songTitle !== '') {
          const song = await new Promise<{ id: string }>((resolve, reject) => {
            dispatch(
              thunkCreateSong({
                title: element.songTitle,
                artist: element.songArtist,
                previewId: Number(element.imageId),
              })
            )
              .then((created: ISong) => {
                if (created?.id) resolve({ id: created.id.toString() });
                else reject(new Error("Song ID is undefined"));
              })
              .catch(reject);
          });
          element.id = song.id;

          if (
            element.ytId === copy[copy.length - 1].ytId &&
            imageId !== undefined
          ) {
            const playlist = await dispatch(
              thunkCreatePlaylist({ name: playlistName, previewId: imageId })
            );
            setCreatedPlaylistId(playlist.id);
          }
        }
      }

      setSongs(copy);
    }

    if (onSubmitIsDone === true) {
      createPlaylistAndSongs();
    }
  }, [onSubmitIsDone, dispatch]);


  useEffect(() => {
    async function addSongsToPlaylist() {
      if (!createdPlaylistId) return;

      for (const [index, element] of songs.entries()) {
        let percentage = (((index + 1) * 100) / songs.length).toFixed(1)
        setLoading(`${percentage}%`)
        const response = await csrfFetch(
          `/api/playlist/${createdPlaylistId}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ songId: element?.id }),
          }
        );
        if (!response.ok) {
          const err = await response.json();
          console.error('Failed to add song', element.id, err);
        }
      }


      closeModal();
    }

    addSongsToPlaylist();
  }, [createdPlaylistId]);
  /////////////////////////
  ///////////useEffect that fetches the user's playlists///////
  useEffect(() => {
    async function youtubeCall() {
      try {
        // const channel = await fetch("https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true",
        //   {
        //     headers: {
        //       Authorization: `Bearer ${store.access_token}`,
        //       Accept: "application/json",
        //     },
        //   })
        //   const channelResults = await channel.json()
        //   // channelId=${channelResults.items[0].id}
        
        const res = await fetch(
          "https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true&maxResults=50",
          {
            headers: {
              Authorization: `Bearer ${store.access_token}`,
              Accept: "application/json",
            },
          }
        );
        
        if (res.status === 401) {
          localStorage.removeItem('oauth2-test-params');
          const initialParams: OAuthParams = JSON.parse(
            import.meta.env.VITE_PARAMS || '{}'
          );
          const form = createOAuthForm(initialParams);
          oauth2SignIn(form);
        }
        if (!res.ok) {
          const err = await res.json();
          throw new Error(`${res.status} ${res.statusText}: ${err.error?.message}`);
        }

        const data = await res.json();
        const cleaned: cleanYoutubePlaylists[] = []
        for (const element of data.items) {
          const obj = {
            id: element.id,
            snippet: {
              channelId: element.snippet.channelId,
              channelTitle: element.snippet.channelTitle,
              description: element.snippet.description,
              publishedAt: element.snippet.publishedAt,
              title: element.snippet.title,
              thumbnails: {
                default: {
                  url: element.snippet.thumbnails?.default?.url,
                  width: element.snippet.thumbnails?.default?.width,
                  height: element.snippet.thumbnails?.default?.height
                },
                medium: {
                  url: element.snippet.thumbnails?.medium?.url,
                  width: element.snippet.thumbnails?.medium?.width,
                  height: element.snippet.thumbnails?.medium?.height
                }
              }
            }
          }

          cleaned.push(obj)
        }

        setPlaylists(cleaned);
      } catch (err) {
        console.error("YouTube API error", err);

      }
    }
    if (youtubeClicked === true) {
      youtubeCall()
    }
  }, [youtubeClicked])
  ///////////////////////////
  return (
  <div className="playlist-transfer-modal-div">
    {onSubmitClicked ? (
      <>
        <h1>{loading}</h1>
        <h2>Popup will automatically close when done</h2>
      </>
    ) : (
      <>
        <form className="spotify-transfer-form" onSubmit={onSubmitSpotify}>
          {spotifyClicked === false && (
            <button
              type="button"
              onClick={() => setSpotifyClicked(true)}
            >
              Transfer From Spotify?
            </button>
          )}

          {spotifyPlaylists?.map((element) => {
            const id = `sp-${element.href}`;
            return (
              <div key={element.href}>
                <label htmlFor={id}>{element.name}</label>
                <input
                  id={id}
                  className="playlist-transfer-input"
                  type="radio"
                  value={element.href}
                  name="playlistURL"
                  onChange={() => {
                    setSpotifyPlaylistName(element.name);
                    setSpotifyPlaylistUrl(element.href);
                    setSpotifyPlaylistImage(element.image);
                  }}
                />
              </div>
            );
          })}

          {spotifyClicked === true && (
            <button type="submit" className="playlist-transfer-submit">
              Spotify Submit
            </button>
          )}
        </form>

        <form
          className="playlist-transfer-form"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmitYoutube(e);
          }}
        >
          {youtubeClicked === false && (
            <button
              type="button"
              onClick={() => setYoutubeClicked(true)}
            >
              Transfer From Youtube?
            </button>
          )}

          {playlists?.map((element) => {
            const id = `yt-${element.id}`;
            return (
              <div key={element.id}>
                <label htmlFor={id}>{element.snippet.title}</label>
                <input
                  id={id}
                  className="playlist-transfer-input"
                  type="radio"
                  value={element.id}
                  name="playlistId"
                  onChange={() => {
                    setPlaylistName(element.snippet.title);
                    setPlaylistURL(element.snippet.thumbnails?.default?.url ?? "");
                    setPlaylistId(element.id);
                  }}
                />
              </div>
            );
          })}

          {youtubeClicked === true && (
            <button type="submit" className="playlist-transfer-submit">
              YT Submit
            </button>
          )}
        </form>
      </>
    )}
  </div>
);
}
export default TransferModal;