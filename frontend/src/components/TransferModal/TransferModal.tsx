import { FormEvent } from "react";
import "./TransferModal.css"
import { useState, useEffect } from "react";
import { thunkCreatePlaylist, thunkGetAllPlaylists } from "../../redux/playlist";
import { useDispatch } from "react-redux";
import { useModal } from '../../context/Modal';
import { thunkCreateImage } from "../../redux/image";
import { thunkCreateSong } from "../../redux/song";
import { IImage } from "../../redux/types/image";
type OAuthParams = {
  client_id?: string;
  redirect_uri?: string;
  response_type?: string;
  scope?: string;
  include_granted_scopes?: string;
  state?: string;
  access_token?: string;
  [key: string]: string | undefined;
};
type YoutubePlaylists = {
  etag: string;
  id: string;
  kind: string;
  snippet: {
    channelId: string;
    channelTitle: string;
    description: string;
    publishedAt: Date;
    title: string;
    thumbnails: {
      default: {
        url: string;
        width: number;
        height: number;
      },
      medium: {
        url: string;
        width: number;
        height: number
      }
    };
  }
}
type YoutubeVideos= {
  etag: string;
  id: string;
  kind: string;
  snippet: {
    channelId: string;
    channelTitle: string;
    description: string;
    publishedAt: Date;
    title: string;
    thumbnails: {
      default: {
        url: string;
        width: number;
        height: number;
      },
      medium: {
        url: string;
        width: number;
        height: number
      }
    };
    videoOwnerChannelTitle: string
  }
}
type cleanYoutubePlaylists = {
  id: string;
  snippet: {
    channelId: string;
    channelTitle: string;
    description: string;
    publishedAt: Date;
    title: string;
    thumbnails: {
      default: {
        url: string;
        width: number;
        height: number;
      },
      medium: {
        url: string;
        width: number;
        height: number
      }
    };
  }
}
  type FilteredYoutubeSong = {
    id: string;
    description: string;
    thumbnails: {
      default: {
        url: string;
        width: number;
        height: number;
      }
    },
    title: string;
    videoOwnerChannelTitle: string;
    imageId: string;
  }
function TransferModal() {
  const [store, setStore] = useState<OAuthParams>(JSON.parse(localStorage.getItem('oauth2-test-params') || '{}'));
  const [playlists, setPlaylists] = useState<cleanYoutubePlaylists[]>()
  const [playlistName, setPlaylistName] = useState<string>("")
  const [playlistURL, setPlaylistURL] = useState<string>("")
  const [playlistId, setPlaylistId] = useState<string>("")
  const [nextPageToken, setNextPageToken] = useState<string>("")
  const [imageId, setImageId] = useState<number>()
  const [songs, setSongs] = useState<FilteredYoutubeSong[]>([])
  const [createdPlaylistId, setCreatedPlaylistId]=useState<number>()
  const dispatch = useDispatch()
  const { closeModal } = useModal()

///////////////On form submit, a user's playlist and all of that playlists items is fetched and the data is then organized.
  async function onSubmit(event: FormEvent) {
  event.preventDefault();

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
          dispatch(thunkCreateImage({ url: element.snippet.thumbnails.default?.url }))
            .then((img: IImage) => {
              if (img?.id) resolve({id: img.id.toString()});
              else reject(new Error("Image ID is undefined"));
            })
            .catch(reject);
        });

        songArray.push({
          id: element.id,
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
          dispatch(thunkCreateImage({ url: element.snippet.thumbnails.default?.url }))
            .then((img: IImage) => {
              if (img?.id) resolve({id: img.id.toString()});
              else reject(new Error("Image ID is undefined"));
            })
            .catch(reject);
        });

        songArray.push({
          id: element.id,
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

    setSongs(songArray);
    console.log(songArray);
  } catch (error) {
    console.log(error);
  }
}

  /////////useEffect that creates a playlist and adds songs to the database after its preview image is created   
  useEffect(() => {
    
    async function createPlaylistAndSongs(){
    if (imageId !== undefined) {
      const playlist=  await dispatch(thunkCreatePlaylist({ name: playlistName, previewId: imageId }))
      setCreatedPlaylistId(playlist.id)
    }

  }
  createPlaylistAndSongs()
  }, [imageId])

  useEffect(()=>{
    async function addSongsToPlaylists(){
      if(createdPlaylistId!==undefined){

      }
    }
  },[createdPlaylistId])

  /////////////////////////
  ///////////useEffect that fetches the user's playlists///////
  useEffect(() => {
    async function youtubeCall() {
      try {
        const res = await fetch(
          "https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true",
          {
            headers: {
              Authorization: `Bearer ${store.access_token}`,
              Accept: "application/json",
            },
          }
        );

        if (!res.ok) {
          const err = await res.json();
          throw new Error(`${res.status} ${res.statusText}: ${err.error?.message}`);
        }

        const data = await res.json();
        const cleaned: cleanYoutubePlaylists[] = []
        data.items.forEach((element: YoutubePlaylists) => {
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
        })

        setPlaylists(cleaned);
      } catch (err) {
        console.error("YouTube API error", err);

      }
    }
    youtubeCall()
  }, [store.access_token])
  ///////////////////////////
  return (
    <div className="playlist-transfer-modal-div">
      <form className="playlist-transfer-form" onSubmit={(e) => {
        e.preventDefault()
        onSubmit(e)
      }}>
        {playlists?.map((element) => {
          return (
            <div key={element.id}><label htmlFor={element.snippet.title}>{element.snippet.title}</label><input className="playlist-transfer-input" type="radio" value={element.id} name="playlistId" onChange={(e) => {
              setPlaylistName(element.snippet.title)
              setPlaylistURL(element.snippet.thumbnails.default.url)
              setPlaylistId(element.id)
            }}></input></div>
          )
        })}
        <button type="submit" className="playlist-transfer-submit">Submit</button>


      </form>
    </div>
  )
}
export default TransferModal;