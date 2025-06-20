import "./SongSearchPage.css"
import { RootState } from '../../redux/store';
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetAllSongs } from "../../redux/song";
import { useParams } from 'react-router-dom';
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";

function SongSearchPage(){
  const songs = useSelector((state: RootState) => state.song.allSongs);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);
    const { id } = useParams()
    
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef<any>();
    const location=useLocation()
    

    const toggleMenu = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
        setShowMenu(!showMenu);
    };


    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e: any) => {
            if (ulRef.current && !ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener("click", closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const closeMenu = () => setShowMenu(false);

   useEffect(() => {
        const getSongs = async () => {
            dispatch(thunkGetAllSongs(location.state));
            setIsLoaded(true);
        };
        if (!isLoaded) {
            getSongs();
        }
    }, [dispatch, songs, isLoaded]);


    return (<>
        <div className="playlist-header">
            <h1>Songs</h1>
        </div>
        <div className="playlist-container-div">
            
                {songs?.map((element, index) => {
                    return <div key={index} className="song-container">
                        <div className="playlist-song-image-container"><img src={element?.Image?.url} /></div>
                        <div>
                            <h3 className="playlist-song-title">{element.title}</h3>
                            <h3 className="playlist-song-artist">{element.artist}</h3>

                        </div>
                        <button className="playlist-song-options-button" onClick={(e) => {
                            e.stopPropagation()
                             toggleMenu(e)}}>...</button>
                        {showMenu && (
                       <ul className="song-dropdown" ref={ulRef}>
                                  <OpenModalMenuItem
                                itemText="Add Song"
                                onItemClick={closeMenu}
                                modalComponent={{}}
                            />
                        </ul>
                        )}
                    </div>
                })}
            <div className="apps-linked-container"></div>
        </div>
    </>

    )
}
export default SongSearchPage;