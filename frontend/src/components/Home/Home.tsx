import "./Home.css"
import { RootState } from '../../redux/store';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetAllPlaylists } from "../../redux/playlist";
import PlaylistUpdateModal from "../PlaylistUpdateModal";
import PlaylistDeleteModal from "../PlaylistDeleteModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import CreatePlaylistModal from "../CreatePlaylistModal";

function Home() {
    const playlists = useSelector((state: RootState) => state.playlist.allPlaylists);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);


    const [showMenu, setShowMenu] = useState(false);
    
    const ulRef = useRef<any>();

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
        const getPlaylists = async () => {
            dispatch(thunkGetAllPlaylists());
            setIsLoaded(true);
        };
        if (!isLoaded) {
            getPlaylists();
        }
    }, [dispatch, playlists.length, isLoaded]);
    console.log(playlists)

    return (<>
        <div className="playlist-header">
            <h1>Playlists</h1>
            <button>Merge</button>
            

                <div className="playlist-button"><OpenModalMenuItem
                    itemText="create"
                    onItemClick={closeMenu}
                    modalComponent={<CreatePlaylistModal />}
                /></div>

            <button>transfer</button>
        </div>
        <div className="playlist-container-div">

            {playlists.map((element, index) => {
                return <div className="playlist-container" key={index} >
                    <div className="playlist-image-container" onClick={(e) => {
                        navigate(`/playlist/${element.id}`);
                    }}><img src={element?.Image?.url} /></div>
                    <div onClick={(e) => {
                        navigate(`/playlist/${element.id}`);
                    }}><h3 className="playlist-name">{element.name}</h3></div>
                    <button className="playlist-options-button" onClick={(e) => toggleMenu(e)}>...</button>
                    {showMenu && (
                        <ul className={"playlist-dropdown"} ref={ulRef}>
                            <OpenModalMenuItem
                                itemText="Delete Playlist"
                                onItemClick={closeMenu}
                                modalComponent={<PlaylistDeleteModal playlistId={{ id: element.id }} />}
                            />
                            <OpenModalMenuItem
                                itemText="Update Playlist"
                                onItemClick={closeMenu}
                                modalComponent={<PlaylistUpdateModal />}
                            />
                        </ul>
                    )}
                </div>
            })}
        </div>
        <div className="apps-linked-container"></div>


    </>)
}
export default Home;