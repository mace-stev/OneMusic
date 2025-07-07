import "./Home.css"
import { RootState } from '../../redux/store';
import { useEffect, useState, useRef, FormEvent } from 'react';
import { FormMethod, FormProps, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetAllPlaylists } from "../../redux/playlist";
import PlaylistUpdateModal from "../PlaylistUpdateModal";
import PlaylistDeleteModal from "../PlaylistDeleteModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import CreatePlaylistModal from "../CreatePlaylistModal";
import { thunkAuthenticate } from "../../redux/session";
import { useModal } from '../../context/Modal';
import SignupFormModal from "../SignupFormModal";
import youtube from "../../yt_logo_mono_dark.png";
import bcrypt from "bcryptjs";
import TransferModal from "../TransferModal";



type OAuthParams = {
  client_id?: string;
  redirect_uri?: string;
  response_type?: string;
  scope?: string;
  include_granted_scopes?: string;
  state?: string;
  access_token?: string;
  [key: string]: string | undefined;
};

function Home() {
  const playlists = useSelector((state: RootState) => state.playlist.allPlaylists);
  const user = useSelector((state: RootState) => state.session.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setModalContent } = useModal();



  //////Youtube OAuth
  const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
  const initialParams: OAuthParams = JSON.parse(
    import.meta.env.VITE_PARAMS || '{}'
  );

  const [params, setParams] = useState<OAuthParams>(initialParams);
  const [store, setStore] = useState<OAuthParams>(JSON.parse(localStorage.getItem('oauth2-test-params') || '{}'));
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fragmentString = window.location.hash.substring(1);
    const updatedParams: OAuthParams = { ...params };

    const regex = /([^&=]+)=([^&]*)/g;
    let m: RegExpExecArray | null;

    while ((m = regex.exec(fragmentString))) {
      updatedParams[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }

    if (Object.keys(updatedParams).length > 0 && !store.access_token) {
      localStorage.setItem('oauth2-test-params', JSON.stringify(updatedParams));
      setParams(updatedParams);
      
      if (updatedParams.state === 'try_sample_request') {
        trySampleRequest(updatedParams);
      }
    }
  }, []);

  async function trySampleRequest(currentParams: OAuthParams) {
    const localParams: OAuthParams = JSON.parse(localStorage.getItem('oauth2-test-params') || '{}');
    setParams(localParams);
    setStore(localParams);

    const stateIsValid = await verifyState(localParams.state || '');

    if (localParams.access_token && stateIsValid) {
      const xhr = new XMLHttpRequest();
      xhr.open(
        'POST',
        `https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true&access_token=${localParams.access_token}`
      );
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          console.log(xhr.response);
        } else if (xhr.readyState === 4 && xhr.status === 401) {
          const form = createOAuthForm();
          oauth2SignIn(form);
        }
      };
      xhr.send(null);
    } else {
      const form = createOAuthForm();
      console.log(store)
      oauth2SignIn(form);
    }
  }
  function createOAuthForm(): HTMLFormElement {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = oauth2Endpoint;
    form.onSubmit((e: FormEvent)=>{
      e.preventDefault()
    })
    return form;
  }

  function oauth2SignIn(form: HTMLFormElement) {
    for (const p in params) {
      if (params.hasOwnProperty(p)) {
        const input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p] || '');
        form.appendChild(input);
      }
    }
   
    document.body.appendChild(form);
    
  
    form.submit();
  }

  async function verifyState(stateToCheck: string): Promise<boolean> {
    const storedState = sessionStorage.getItem('oauth2-state');
    if (!storedState) return false;


    return bcrypt.compare(stateToCheck, storedState);
  }
//////////////////////////////////////////
//////////////////////////////////////////
  //////////////Modal Menu Functionality////////
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
    if (user) {
      const getPlaylists = async () => {
        dispatch(thunkGetAllPlaylists());
        setIsLoaded(true);

      };
      if (!isLoaded) {
        getPlaylists();
      }

    }
    thunkGetAllPlaylists()

  }, [dispatch, playlists.length, isLoaded]);

  useEffect(() => {
    if (!user) {
      thunkAuthenticate()
      if(!user){
      setModalContent(<SignupFormModal />)
      }
     }
  }, [user])

  return (<div className="home-page">
    <section className="playlist-section">
      <div className="playlist-header">
        <h1>Playlists</h1>
        <div className="playlist-button"><OpenModalMenuItem
          itemText="Merge"
          onItemClick={closeMenu}
          modalComponent={<CreatePlaylistModal />}
        /></div>


        <div className="playlist-button"><OpenModalMenuItem
          itemText="create"
          onItemClick={closeMenu}
          modalComponent={<CreatePlaylistModal />}
        /></div>

         <div className="playlist-button"><OpenModalMenuItem
          itemText="transfer"
          onItemClick={closeMenu}
          modalComponent={<TransferModal />}
        /></div>
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
            <button className="playlist-options-button" onClick={(e) => toggleMenu(index, e)}>...</button>
            {showMenu[index] && (
              <ul className={"playlist-dropdown"} ref={(el) => (ulRefs.current[index] = el)}>
                <OpenModalMenuItem
                  itemText="Delete Playlist"
                  onItemClick={closeMenu}
                  modalComponent={<PlaylistDeleteModal playlistId={{ id: element.id }} />}
                />
                <OpenModalMenuItem
                  itemText="Update Playlist"
                  onItemClick={closeMenu}
                  modalComponent={<PlaylistUpdateModal playlistId={element.id} previewId={element.previewId} />}
                />
              </ul>
            )}
          </div>
        })}
      </div>
    </section>
    <div className="apps-linked-container">
      {!store.access_token ? (
        <form
          method="POST"
          className="YT-sign-in-form"
          action={oauth2Endpoint}
          onSubmit={(e) => {
            e.preventDefault();

            const form = e.target as HTMLFormElement;
            oauth2SignIn(form);
          }}
        >
          <button type="submit" className="YT-sign-in">
            <img src={youtube} />Sign in to YouTube
          </button>
        </form>
      )
        : (
          <button className="YT-sign-in">
            <img src={youtube} />Signed in to Youtube
          </button>
        )}
    </div>


  </div>)
}
export default Home;