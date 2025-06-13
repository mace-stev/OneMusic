import './PlaylistDetails.css'
import { RootState } from '../../redux/store';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetOnePlaylist } from "../../redux/playlist";
import { useParams } from 'react-router-dom';
function PlaylistDetails(){
        const playlist = useSelector((state: RootState) => state.playlist.allPlaylists);
        const dispatch = useDispatch();
        const navigate = useNavigate();
        const [isLoaded, setIsLoaded] = useState(false);
        const {id} = useParams()
    
          useEffect(() => {
            const getPlaylists = async () => {
                if(id){
                dispatch(thunkGetOnePlaylist(id));
                setIsLoaded(true);
                }
            };
            if (!isLoaded) {
                getPlaylists();
            }
        }, [dispatch, id]);
        console.log(playlist)


    return(<></>)
}
export default PlaylistDetails