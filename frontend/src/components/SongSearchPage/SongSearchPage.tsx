import "./SongSearchPage.css"
import { RootState } from '../../redux/store';
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetAllSongs } from "../../redux/song";
import { useParams } from 'react-router-dom';
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import AddSongModal from "../AddSongModal";
import ISong from "../../redux/types/song";

function SongSearchPage() {
  const songs = useSelector((state: RootState) => state.song.allSongs);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [isLoaded, setIsLoaded] = useState(false);

  // Fix: Use a Record type to map song index to a boolean
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
    const getSongs = async () => {
      await dispatch(thunkGetAllSongs(location.state));
      setIsLoaded(true);
    };
    if (!isLoaded) getSongs();
  }, [dispatch, location.state, isLoaded]);

  return (
    <>
      <div className="playlist-header">
        <h1>Songs</h1>
      </div>
      <div className="playlist-container-div">
        {songs?.map((element, index) => (
          <div key={index} className="song-container">
            <div className="playlist-song-image-container">
              <img src={element?.Image?.url} alt="Song cover" />
            </div>
            <div>
              <h3 className="playlist-song-title">{element.title}</h3>
              <h3 className="playlist-song-artist">{element.artist}</h3>
            </div>
            <button
              className="playlist-song-options-button"
              onClick={(e) => toggleMenu(index, e)}
            >
              ...
            </button>
            {showMenu[index] && (
              <ul
                className="song-dropdown"
                ref={(el) => (ulRefs.current[index] = el)}
              >
                <OpenModalMenuItem
                  itemText="Add Song"
                  onItemClick={closeMenu}
                  modalComponent={<AddSongModal songId={element.id}/>}
                />
              </ul>
            )}
          </div>
        ))}
        <div className="apps-linked-container"></div>
      </div>
    </>
  );
}

export default SongSearchPage;