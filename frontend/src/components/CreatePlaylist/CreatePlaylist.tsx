import './CreatePlaylist.css'
import { useState, useEffect } from 'react';
import { thunkCreateImage } from '../../redux/image';
import { thunkCreatePlaylist } from '../../redux/playlist';

function CreatePlaylist(){
 const [playlistName, setPlaylistName] = useState("")
 const [playlistURL, setPlaylistURL] = useState("")
 const [imageId, setImageId] = useState()
    useEffect(()=>{
        if(imageId!==undefined){
            thunkCreatePlaylist({name: playlistName, previewId: imageId})
        }
    },[imageId])
   async function onSubmit(event: Event){
       const imageResponse= await thunkCreateImage({url: playlistURL})
       setImageId(imageResponse.id)
    }

    return(
       <form  className="playlist-create-form">
        <input className="playlist-create-input" placeholder='Playlist Name' value={playlistName} onChange={(e)=>{
            setPlaylistName(e.target.value)
        }}></input>
        <input className="playlist-create-input" placeholder='Playlist Image URL' value={playlistURL} onChange={(e)=>{
            setPlaylistURL(e.target.value)
        }}></input>
        <button type="submit">Submit</button>

         
          </form>
    )

}
export default CreatePlaylist;