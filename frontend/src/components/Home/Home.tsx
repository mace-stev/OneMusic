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
import { thunkAuthenticate } from "../../redux/session";
import { useModal } from '../../context/Modal';
import SignupFormModal from "../SignupFormModal";
function Home() {
    const playlists = useSelector((state: RootState) => state.playlist.allPlaylists);
    const user = useSelector((state: RootState)=> state.session.user)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);
    const { setModalContent}=useModal()

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
        if(user){
        const getPlaylists = async () => {
            dispatch(thunkGetAllPlaylists());
            setIsLoaded(true);
            
        };
        if (!isLoaded) {
            getPlaylists();
        }
    }

    }, [dispatch, playlists.length, isLoaded]);

    useEffect(()=>{
        if(!user){
            setModalContent(<SignupFormModal/>)
        }
    },[user])

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
                    <button className="playlist-options-button" onClick={(e) =>  toggleMenu(index, e)}>...</button>
                    {showMenu[index]  && (
                        <ul className={"playlist-dropdown"}  ref={(el) => (ulRefs.current[index] = el)}>
                            <OpenModalMenuItem
                                itemText="Delete Playlist"
                                onItemClick={closeMenu}
                                modalComponent={<PlaylistDeleteModal playlistId={{ id: element.id }} />}
                            />
                            <OpenModalMenuItem
                                itemText="Update Playlist"
                                onItemClick={closeMenu}
                                modalComponent={<PlaylistUpdateModal playlistId={element.id} previewId={element.previewId}/>}
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