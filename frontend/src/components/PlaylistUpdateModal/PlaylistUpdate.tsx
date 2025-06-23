import './PlaylistUpdateModal.css'
import { useState, useEffect, FormEvent } from 'react';
import { thunkUpdateImage } from '../../redux/image';
import { thunkUpdatePlaylist, thunkGetAllPlaylists } from '../../redux/playlist';
import { useDispatch} from 'react-redux';
import { useModal } from '../../context/Modal';

type PlaylistModalAttributes={
  playlistId: number,
  previewId: number
}
function PlaylistUpdateModal({playlistId, previewId}: PlaylistModalAttributes){

        const [playlistName, setPlaylistName] = useState("")
         const [playlistURL, setPlaylistURL] = useState("")
         const [imageId, setImageId] = useState()
          const dispatch = useDispatch();
          const { closeModal } = useModal();

           async function onSubmit(event: FormEvent){
                event.preventDefault()
               await dispatch(thunkUpdateImage({id: previewId, url: playlistURL}))
               dispatch(thunkUpdatePlaylist({id: playlistId, name: playlistName, previewId: previewId}))
                    dispatch(thunkGetAllPlaylists())
        
                    closeModal()
        
            }
        
            return(
                  <div className="playlist-update-modal-div">
               <form  className="playlist-update-form" onSubmit={(e)=>{
                onSubmit(e)
               }}>
                <h1>Update Playlist</h1>
                <input className="playlist-update-input" placeholder='Playlist Name' value={playlistName} onChange={(e)=>{
                    setPlaylistName(e.target.value)
                }}></input>
                <input className="playlist-update-input" placeholder='Playlist Image URL' value={playlistURL} onChange={(e)=>{
                    setPlaylistURL(e.target.value)
                }}></input>
                <button className="playlist-update-submit" type="submit">Submit</button>
        
                 
                  </form>
                  </div>
            )
    }
export default PlaylistUpdateModal