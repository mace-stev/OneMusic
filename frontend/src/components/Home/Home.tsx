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
import spotify from "../../spotify-1759471_1280.jpg"
import bcrypt from "bcryptjs";
import TransferModal from "../TransferModal";
import { OAuthParams } from "../../../types/youtube";
import { createOAuthForm, oauth2SignIn } from "../../../utils/YTAuth"
import { sha256, codeVerifier, base64encode } from "../../../utils/SpotifyAuth"
import PlaylistMergeModal from "../PlaylistMergeModal";






function Home() {
  const playlists = useSelector((state: RootState) => state.playlist.allPlaylists);
  const user = useSelector((state: RootState) => state.session.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setModalContent } = useModal();
  const [spotifyAuthCode, setSpotifyAuthCode] = useState<string>("")
  const [spotifyAccessCode, setSpotifyAccessCode]= useState<string>("")


  ///////Spotify OAuth////
async function spotifySignIn() {
  const hashed = await sha256(codeVerifier);
  const challenge = base64encode(hashed);
  window.localStorage.setItem('code_verifier', codeVerifier);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    scope: "playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public ugc-image-upload",
    code_challenge_method: 'S256',
    code_challenge: challenge,
    redirect_uri: import.meta.env.VITE_SPOTIFY_REDIRECT_URL,
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params}`;
}
 useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  if (code) {
    setSpotifyAuthCode(code);
    window.history.replaceState(
      {}, 
      '', 
      window.location.origin + window.location.pathname
    );
  }
}, []);




  useEffect(() => {
    const getToken = async (code: string) => {
      type urlParams = {
        client_id: string;
        grant_type: string;
        code: string;
        redirect_uri: string;
        code_verifier: string
      }
      const codeVerifier = localStorage.getItem('code_verifier');
      console.log(import.meta.env.VITE_SPOTIFY_REDIRECT_URL)
      if (typeof (codeVerifier) === 'string') {
        const spotifyUrlParams: urlParams = {
          client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: import.meta.env.VITE_SPOTIFY_REDIRECT_URL,
          code_verifier: codeVerifier
        }


        // stored in the previous step


        const url = "https://accounts.spotify.com/api/token";
        const payload = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams(spotifyUrlParams),
        }

        const body = await fetch(url, payload);

        const response = await body.json();
        console.log(response)

        localStorage.setItem('access_token', response.access_token);
        setSpotifyAccessCode(response.access_token)
      }

    }
    if (spotifyAuthCode !== "") {
      getToken(spotifyAuthCode)
    }

  }, [spotifyAuthCode])



  //////Youtube OAuth////////
  const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
  const initialParams: OAuthParams = JSON.parse(
    import.meta.env.VITE_PARAMS || '{}'
  );

  const [params, setParams] = useState<OAuthParams>(initialParams);
  const [store, setStore] = useState<OAuthParams>(JSON.parse(localStorage.getItem('oauth2-test-params') || '{}'));
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (!hash) return;
    const updated: OAuthParams = { ...store };
    new URLSearchParams(hash).forEach((val, key) => {
      (updated as any)[key] = val;
    });

    setParams(updated);
    setStore(updated);
    localStorage.setItem("oauth2-test-params", JSON.stringify(updated));
    window.history.replaceState(
      {},
      document.title,
      window.location.pathname + window.location.search
    );
    if (updated.state === "try_sample_request") {
      trySampleRequest();
    }
  }, []);


  async function trySampleRequest() {
    const localParams: OAuthParams =
      JSON.parse(localStorage.getItem('oauth2-test-params') || '{}');

    setParams(localParams);
    setStore(localParams);


    const stateIsValid = await verifyState(localParams.state || '');


    if (localParams.access_token && stateIsValid) {
      const xhr = new XMLHttpRequest();
      xhr.open(
        'POST',
        `https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true&access_token=${localParams.access_token}`
      );
      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) return;

        else if (xhr.status === 401) {

          localStorage.removeItem('oauth2-test-params');
          setParams(initialParams);
          setStore(initialParams);

          const form = createOAuthForm(initialParams);
          oauth2SignIn(form);
        }
      };
      xhr.send(null);
    }
    else {

      localStorage.removeItem('oauth2-test-params');
      setParams(initialParams);
      setStore(initialParams);

      const form = createOAuthForm(initialParams);
      oauth2SignIn(form);
    }
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
      if (!user) {
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
          modalComponent={<PlaylistMergeModal playlists={playlists}/>}
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
        <button
          className="YT-sign-in"
          onClick={() => {
            const form = createOAuthForm(initialParams);
            oauth2SignIn(form);
          }}
        >
          <img src={youtube} /> Sign in to YouTube
        </button>
      )
        : (
          <button className="YT-sign-in">
            <img src={youtube} />Signed in to Youtube
          </button>
        )}
      {spotifyAccessCode!=="" ? (
        <button
          className="spotify-sign-in"
          onClick={() => {
            spotifySignIn()
          }}
        >
          <img src={spotify} /> Sign in to Spotify
        </button>
      )
        : (
          <button className="spotify-sign-in">
            <img src={spotify} />Signed in to Spotify
          </button>
        )}
    </div>


  </div>)
}
export default Home;