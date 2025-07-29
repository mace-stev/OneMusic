import './PlaylistDetails.css'
import { RootState } from '../../redux/store';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetOnePlaylist } from "../../redux/playlist";
import { useParams } from 'react-router-dom';
import SongDeleteModal from '../SongDeleteModal';
import SongUpdateModal from '../SongUpdateModal/SongUpdateModal';
import UploadModal from '../UploadModal';

import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
function PlaylistDetails() {
    const playlist = useSelector((state: RootState) => state.playlist.allPlaylists);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);
    const { id } = useParams()
    const playlistSongs = playlist[0]?.Songs
    const [showMenu, setShowMenu] = useState<Record<number, boolean>>({});
  const ulRefs = useRef<Record<number, HTMLUListElement | null>>({});

  const toggleMenu = (index: number, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    setShowMenu(prev => ({
      ...Object.fromEntries(Object.keys(prev).map(k => [Number(k), false])), // Close all other menus
      [index]: !prev[index]
    }));
  };

  const closeMenu = () => {
    setShowMenu({});
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      for (const key in ulRefs.current) {
        const ref = ulRefs.current[key];
        if (ref && !ref.contains(e.target as Node)) {
          closeMenu();
          return;
        }
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

    useEffect(() => {
        const getPlaylists = async () => {
            if (id) {
                dispatch(await thunkGetOnePlaylist(id));
                setIsLoaded(true);
            }
        };
        if (!isLoaded) {
            getPlaylists();
        }
    }, [dispatch, id]);
    


    return (<>
        <div className="playlist-header">
            <h1 id='playlist-title'>{playlist[0]?.name} Songs</h1>
             <div className="playlist-button"><OpenModalMenuItem
          itemText="upload"
          onItemClick={closeMenu}
          modalComponent={<UploadModal playlistSongs={playlistSongs} playlist={playlist}/>}
        /></div>
        </div>
        <div className="playlist-container-div">
        
                {playlistSongs?.map((element, index) => {
                    return <div key={index} className="playlist-song-container">
                        <div className="playlist-song-image-container"><img src={element?.Image?.url} /></div>
                        <div>
                            <h3 className="playlist-song-title">{element.title}</h3>
                            <h3 className="playlist-song-artist">{element.artist}</h3>

                        </div>
                
                        <button className="playlist-song-options-button" onClick={(e) => {
                            e.stopPropagation()
                             toggleMenu(index, e)}}>...</button>
                        {showMenu[index] && (
                       <ul className={"playlist-song-dropdown"} ref={(el) => (ulRefs.current[index] = el)}>
                            <OpenModalMenuItem
                                itemText="Delete Song"
                                onItemClick={closeMenu}
                                modalComponent={<SongDeleteModal songId={{id: element.id}} />}
                            />
                            <OpenModalMenuItem
                                itemText="Update Song"
                                onItemClick={closeMenu}
                                modalComponent={<SongUpdateModal playlistId={{id: playlist[0].id}} songData={{id: element.id, 
                                  
                                  previewId: element.Image?.id}}  />}
                            />
                        </ul>
                        )}
                    </div>
                })}
        
        </div>
    </>

    )

}
export default PlaylistDetails