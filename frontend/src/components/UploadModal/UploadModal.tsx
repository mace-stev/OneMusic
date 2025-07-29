import "./UploadModal.css"
import { IPlaylist } from "../../redux/types/playlist"
import { FormEvent, useState, useEffect } from "react";
import { OAuthParams } from "../../../types/youtube";
import { createOAuthForm, oauth2SignIn } from "../../../utils/YTAuth";
import { spotifySignIn } from "../../../utils/SpotifyAuth";
import { useModal } from '../../context/Modal';
type UploadModalAttributes = {
    playlistSongs: IPlaylist['Songs'],
    playlist: IPlaylist[]
}
export default function UploadModal({ playlistSongs, playlist }: UploadModalAttributes) {
    const [store, setStore] = useState<OAuthParams>(JSON.parse(localStorage.getItem('oauth2-test-params') || '{}'));
    const [onSubmitIsDone, setOnSubmitIsDone] = useState<boolean>(false)
    const [onSubmitClicked, setOnSubmitClicked] = useState<boolean>(false)
    const [videosToAdd, setVideosToAdd] = useState<Record<number, string>>({});
    const [playlistId, setPlaylistId] = useState<number>(0)
    const { closeModal } = useModal()
    const [loading, setLoading] = useState<string>("Please Wait...")


    async function onSubmitSpotify(e: FormEvent) {
        e.preventDefault()
        try {
            const accessToken = localStorage.getItem('spotify_access_token')
            const currUser = await fetch("https://api.spotify.com/v1/me", {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            if (currUser.status === 401) {
                spotifySignIn()
            }

            const currUserData = await currUser.json()
            const currUserId = currUserData.id
            const createSpotifyPlaylist = await fetch(`https://api.spotify.com/v1/users/${currUserId}/playlists`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                    body: JSON.stringify({ name: playlist[0].name })
                }
            )
            const results = await createSpotifyPlaylist.json()
            const playlistUrl = results.href

            if (playlistSongs) {
                const bundledURLS: Record<number, string[]> = {}
                let n = 0
                bundledURLS[n] = []
                for (const [index, element] of playlistSongs.entries()) {
                     let percentage = (((index + 1) * 100) / playlistSongs.length).toFixed(1)
                    setLoading(`Searching Songs Progress: ${percentage}%`)
                    const q = `track:"${element.title}" artist:"${element.artist}"`;
                    const params = new URLSearchParams({
                        q,
                        type: "track",
                    });
                    const searchSongs = await fetch(`https://api.spotify.com/v1/search?${params.toString()}`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    })
                    const result = await searchSongs.json()

                    if (result.tracks.items.length > 0) {
                        element.url = result.tracks.items[0].uri
                        if (bundledURLS[n].length < 100 && element.url) {
                            bundledURLS[n].push(element.url)
                        }
                        else if (bundledURLS[n].length >= 100 && element.url) {
                            n = n + 1
                            bundledURLS[n] = []
                            bundledURLS[n].push(element.url)
                        }
                    }
                }


                for (const element of Object.values(bundledURLS)) {
                    
                    const addSongs = await fetch(`${playlistUrl}/tracks`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        },
                        body: JSON.stringify({ uris: element })
                    })
                }
                console.log('done')
                closeModal()
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        async function addVideosToYT() {
            if (onSubmitIsDone === true) {
                const videosToAddValues = Object.values(videosToAdd)
                for (const [index, element] of videosToAddValues.entries()) {
                    let percentage = (((index + 1) * 100) / videosToAddValues.length).toFixed(1)
                    setLoading(`${percentage}%`)
                    const video = {
                        snippet: {
                            playlistId: playlistId,
                            resourceId: {
                                kind: "youtube#video",
                                videoId: element
                            }
                        }
                    }
                    const res = await fetch("https://www.googleapis.com/youtube/v3/playlistItems?part=snippet", {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${store.access_token}`,
                            Accept: "application/json",
                            "Content-Type": "application/json"

                        },
                        body: JSON.stringify(video)
                    })
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
                }
                closeModal()
            }
        }
        addVideosToYT()


    }, [onSubmitIsDone])


    async function onSubmit(e: FormEvent) {
        const playlistData = {
            snippet: {
                title: playlist[0].name
            }
        }
        e.preventDefault()
        const searchResults: Record<number, string> = {};
        const createYTPlaylist = await fetch("https://www.googleapis.com/youtube/v3/playlists?part=snippet", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${store.access_token}`,
                Accept: "application/json",
                "Content-Type": "application/json"

            },
            body: JSON.stringify(playlistData)
        })
        if (!createYTPlaylist.ok) {
            const err = await createYTPlaylist.json();
            throw new Error(`${createYTPlaylist.status} ${createYTPlaylist.statusText}: ${err.error?.message}`);
        }

        const createYTPlaylistResults = await createYTPlaylist.json()
        setPlaylistId(createYTPlaylistResults.id)
        if (playlistSongs) {
            for (const [index, element] of playlistSongs.entries()) {
                const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${element.title} ${element.artist} explicit`,
                    {
                        headers: {
                            Authorization: `Bearer ${store.access_token}`,
                            Accept: "application/json",

                        },
                    }
                )
                const result = await res.json()
                searchResults[`${index}`] = result.items[0].id.videoId

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
                if (playlistSongs[index] === playlistSongs[playlistSongs.length - 1]) {
                    setOnSubmitIsDone(true)
                    setVideosToAdd(searchResults)
                }
            }
        }
    }
    return (<div className="playlist-upload-modal-div">
        {onSubmitClicked ? (
            <>
                <h1>{loading}</h1>
                <h2>Popup will automatically close when done</h2>
            </>
        ) : (
            <>
                <form className="upload-modal-form" onSubmit={(e) => {
                    setOnSubmitClicked(true)
                    onSubmit(e)

                }}>
                    <button className="playlist-upload-submit" type="submit">Upload Playlist To Youtube</button>

                </form>
                <form className="upload-modal-form" onSubmit={(e) => {
                    setOnSubmitClicked(true)
                    onSubmitSpotify(e)
                }}>
                    <button className="playlist-upload-submit" type="submit">Upload Playlist To Spotify</button>
                </form>
            </>
        )}

    </div>)
}