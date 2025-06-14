import "./Home.css"
import { RootState } from '../../redux/store';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetAllPlaylists } from "../../redux/playlist";

function Home() {
    const playlists = useSelector((state: RootState) => state.playlist.allPlaylists);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);

      useEffect(() => {
        const getPlaylists = async () => {
            dispatch(thunkGetAllPlaylists());
            setIsLoaded(true);
        };
        if (!isLoaded) {
            getPlaylists();
        }
    }, [dispatch, playlists, isLoaded]);
    console.log(playlists)

    return (<>
        <div className="playlist-header">
            <h1>Playlists</h1>
            <button>Merge</button>
            <button>Upload</button>
            <button>transfer</button>
        </div>
        <div className="playlist-container-div">
            <div className="playlist-container">
                {playlists.map((element, index)=>{
                    return<div key={index} onClick={(e)=>{
                        navigate(`/playlist/${element.id}`);
                    }}>
                        <div className="playlist-image-container"><img src={element?.Image?.url}/></div>
                        <div><h3 className="playlist-name">{element.name}</h3></div>
                        <button className="playlist-options-button">...</button>
                        </div>
                })}
            </div>
            <div className="apps-linked-container"></div>
        </div>

    </>)
}
export default Home;