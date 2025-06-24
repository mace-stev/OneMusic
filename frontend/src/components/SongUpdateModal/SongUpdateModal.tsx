import './SongUpdateModal.css'
import { ISongForm } from "../../redux/types/song";
import { FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { IPlaylistId } from '../../redux/types/playlist';
import { thunkGetOnePlaylist } from '../../redux/playlist';
import { thunkUpdateImage } from '../../redux/image';


type SongUpdateModalProps={
  songData: ISongForm,
  playlistId : IPlaylistId
}
function SongUpdateModal({songData, playlistId}: SongUpdateModalProps){

 
         const [songURL, setSongURL] = useState("")
         const [imageId, setImageId] = useState()
          const dispatch = useDispatch();
          const { closeModal } = useModal();

           async function onSubmit(event: FormEvent){
                event.preventDefault()
                if(songData.previewId){
                dispatch(await thunkUpdateImage({id: songData.previewId, url: songURL}))
                    dispatch(await thunkGetOnePlaylist((playlistId.id).toString()))
        
                    closeModal()
                }
        
            }
        

  return(
                  <div className="song-update-modal-div">
               <form  className="song-update-form" onSubmit={(e)=>{
                onSubmit(e)
               }}>
                <h1>Update Song</h1>
               
                <input className="song-update-input" placeholder='Song Image URL' value={songURL} onChange={(e)=>{
                    setSongURL(e.target.value)
                }}></input>
                <button className="song-update-submit" type="submit">Submit</button>
        
                 
                  </form>
                  </div>
            )
    }
export default SongUpdateModal