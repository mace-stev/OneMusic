import './CreatePlaylistModal.css'
import { useState, useEffect, FormEvent } from 'react';
import { thunkCreateImage } from '../../redux/image';
import { thunkCreatePlaylist, thunkGetAllPlaylists } from '../../redux/playlist';
import { useDispatch} from 'react-redux';
import { useModal } from '../../context/Modal';
function CreatePlaylistModal(){
 const [playlistName, setPlaylistName] = useState("")
 const [playlistURL, setPlaylistURL] = useState("")
 const [imageId, setImageId] = useState()
  const dispatch = useDispatch();
  const { closeModal } = useModal();
    useEffect(()=>{
        console.log(imageId)
        if(imageId!==undefined){
            dispatch(thunkCreatePlaylist({name: playlistName, previewId: imageId}))
            dispatch(thunkGetAllPlaylists())

            closeModal()
        }

    },[imageId])
   async function onSubmit(event: FormEvent){
        event.preventDefault()
        if(playlistURL===""){
            const undefinedImageUrl="https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-blank-avatar-modern-vector-png-image_40962406.jpg"
            const imageResponse= await dispatch(thunkCreateImage({url: undefinedImageUrl}))
           setImageId(imageResponse.id)
            return

       
        }
       const imageResponse= await dispatch(thunkCreateImage({url: playlistURL}))

       setImageId(imageResponse.id)
    }

    return(
          <div className="playlist-create-modal-div">
       <form  className="playlist-create-form" onSubmit={(e)=>{
        onSubmit(e)
       }}>
        <input className="playlist-create-input" placeholder='Playlist Name' value={playlistName} onChange={(e)=>{
            setPlaylistName(e.target.value)
        }}></input>
        <input className="playlist-create-input" placeholder='Playlist Image URL' value={playlistURL} onChange={(e)=>{
            setPlaylistURL(e.target.value)
        }}></input>
        <button type="submit" className="playlist-create-submit">Submit</button>

         
          </form>
          </div>
    )

}
export default CreatePlaylistModal;