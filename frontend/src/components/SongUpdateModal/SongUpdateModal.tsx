import './SongUpdateModal.css'
import { ISongId } from "../../redux/types/song";


type SongUpdateModalProps={
  songId: ISongId
}
function SongUpdateModal({songId}: SongUpdateModalProps){
 return (
        <div className="song-update-modal-div">
        
          <form  className="song-update-form">
         
          </form>
        </div>
      );
    }
export default SongUpdateModal