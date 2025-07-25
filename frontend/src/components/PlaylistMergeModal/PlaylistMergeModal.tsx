import "./PlaylistMergeModal.css"
import { IPlaylist } from "../../redux/types/playlist"
import { FormEvent, useState, useEffect } from "react"
import { thunkGetOnePlaylist, thunkRemovePlaylist } from "../../redux/playlist"
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "../../redux/store";
import { csrfFetch } from "../../redux/csrf";

type PlaylistMergeModalAttributes = {
    playlists: IPlaylist[]
}
export default function PlaylistMergeModal({ playlists }: PlaylistMergeModalAttributes) {
    const dispatch = useDispatch()
    const [playlist1, setPlaylist1] = useState<string>("")
    const [playlist2, setPlaylist2] = useState<string>("")
    const currentPlaylist = useSelector((state: RootState) => state.playlist.allPlaylists);
    const [playlist1Songs, setPlaylist1Songs] = useState<IPlaylist['Songs']>()
    const [playlist2Songs, setPlaylist2Songs] = useState<IPlaylist['Songs']>()
    const [error, setError]= useState<string>("")
    async function onSubmit(e: FormEvent) {
        try {
            e.preventDefault()
            if (playlist1 === playlist2) {
                setError("Can't select the same playlist for both inputs")
                throw new Error("Can't select the same playlist for both inputs")
                
            }
            const playlistOne = await dispatch(thunkGetOnePlaylist(playlist1))
            setPlaylist1Songs(playlistOne.Songs)
            const playlistTwo = await dispatch(thunkGetOnePlaylist(playlist2))
            setPlaylist2Songs(playlistTwo.Songs)
            console.log(playlist1Songs)
        } catch (err) {
            console.log(err)
        }


    }

    useEffect(() => {
        async function mergePlaylist() {
            const completePlaylist = new Map()
            if (playlist1Songs !== undefined && playlist2Songs !== undefined) {

                for (const element of playlist1Songs) {
                    completePlaylist.set(element.title, [element.artist])
                }
                for (const element of playlist2Songs) {
                    if (!completePlaylist.has(element.title) || completePlaylist.get(element.title)[0] !== element.artist) {
                        const response = await csrfFetch(
                            `/api/playlist/${playlist1}`,
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

                }
                console.log(playlist1Songs)
                console.log(playlist2Songs)
                await dispatch(thunkRemovePlaylist({ id: Number(playlist2) }))
            }
        }
        mergePlaylist()
    }, [playlist1Songs, playlist2Songs])


    return (<div className="playlist-merge-modal-div">
        <form className="playlist-merge-form" onSubmit={(e) => {
            onSubmit(e)
        }}>
            <h2>Select first playlist to merge.</h2>
            {playlists?.map((element) => {
                return (
                    <div key={element.id}><label htmlFor={element.name}>{element.name}</label><input className="playlist-merge-input" type="radio" value={element.id} name="playlist1" onChange={(e) => {
                        setPlaylist1((element.id).toString())
                    }}></input></div>
                )
            })}
            <h2>Select second playlist to merge.</h2>
            {playlists?.map((element) => {
                return (
                    <div key={element.id}><label htmlFor={element.name}>{element.name}</label><input className="playlist-merge-input" type="radio" value={element.id} name="playlist2" onChange={(e) => {
                        setPlaylist2((element.id).toString())
                    }}></input></div>
                )
            })}
            <div className="error-message">{error}</div>
            <button className="playlist-merge-submit" type="submit">Submit</button>


        </form>
    </div>)
}