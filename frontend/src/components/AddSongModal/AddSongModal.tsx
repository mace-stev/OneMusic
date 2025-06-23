import './AddSongModal.css'
import { thunkGetAllPlaylists } from '../../redux/playlist';
import { csrfFetch } from '../../redux/csrf';
import { useDispatch, useSelector } from 'react-redux';
import { FormEvent, useEffect, useState } from 'react';
import { RootState } from '../../redux/store';
import { useModal } from '../../context/Modal';
type AddSongAttributes={
    songId: number
}
function AddSongModal({songId}: AddSongAttributes){
    const dispatch= useDispatch()
    const playlists = useSelector((state: RootState) => state.playlist.allPlaylists);
    const playlistValues: string[]=[]
     const [isLoaded, setIsLoaded] = useState(false);
     const { closeModal } = useModal();
     
     useEffect(() => {
        const getPlaylists = async () => {
            dispatch(thunkGetAllPlaylists());
            setIsLoaded(true);
        };
        if (!isLoaded) {
            getPlaylists();
        }
    }, [dispatch, playlists.length, isLoaded]);
    function onSubmit(e: FormEvent){
        e.preventDefault();
        playlistValues.forEach(async(element)=>{
            try {
                let songData={
                    songId: songId
                }
                        const response = await csrfFetch(`/api/playlist/${element}`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(songData),
                          
                        });
                        if (response.ok) {
                            const data = await response.json();
                            closeModal()
                            return data;
                        } else {
                            throw response;
                        }
                    } catch (e) {
                        const err = e as Response;
                        const errorMessages = await err.json();
                        return errorMessages;
                    }
        })
    }
    return(<>
    <form className="add-song-form" onSubmit={(e)=>{onSubmit(e)}}>
       <h1 className="add-song-header">Which playlist would you like to add the song to?</h1>
       {playlists.map((element, index)=>{
        return(<label key={index}>{element.name}<input type='checkbox' value={element.id} onChange={(e)=>{
            if(playlistValues.includes(e.target.value)===false){
                playlistValues.push(e.target.value)
            }
        }}
        ></input></label>)
       })}

       <input className="add-song-submit" type="submit"></input>
    </form>
    </>)
}
export default AddSongModal;