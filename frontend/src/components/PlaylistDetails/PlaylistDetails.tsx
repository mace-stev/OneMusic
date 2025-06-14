import './PlaylistDetails.css'
import { RootState } from '../../redux/store';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetOnePlaylist } from "../../redux/playlist";
import { useParams } from 'react-router-dom';
import SongDeleteModal from '../SongDeleteModal';
import SongUpdateModal from '../SongUpdateModal/SongUpdateModal';

import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
function PlaylistDetails() {
    const playlist = useSelector((state: RootState) => state.playlist.allPlaylists);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);
    const { id } = useParams()
    const playlistSongs = playlist[0]?.Songs
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
            if (id) {
                dispatch(thunkGetOnePlaylist(id));
                setIsLoaded(true);
            }
        };
        if (!isLoaded) {
            getPlaylists();
        }
    }, [dispatch, id]);
    console.log(playlist)


    return (<>
        <div className="playlist-header">
            <h1>Songs</h1>
        </div>
        <div className="playlist-container-div">
            <div className="playlist-song-container">
                {playlistSongs?.map((element, index) => {
                    return <div key={index} >
                        <div className="playlist-song-image-container"><img src={element?.Image?.url} /></div>
                        <div>
                            <h3 className="playlist-song-title">{element.title}</h3>
                            <h3 className="playlist-song-artist">{element.artist}</h3>

                        </div>
                        <button className="playlist-song-options-button" onClick={(e) => toggleMenu(e)}>...</button>
                        {showMenu && (
                       <ul className={"playlist-song-dropdown"} ref={ulRef}>
                            <li><OpenModalMenuItem
                                itemText="Delete Song"
                                onItemClick={closeMenu}
                                modalComponent={<SongDeleteModal />}
                            /></li>
                            <li><OpenModalMenuItem
                                itemText="Update Song"
                                onItemClick={closeMenu}
                                modalComponent={<SongUpdateModal />}
                            /></li>
                        </ul>
                        )}
                    </div>
                })}
            </div>
            <div className="apps-linked-container"></div>
        </div>
    </>

    )

}
export default PlaylistDetails