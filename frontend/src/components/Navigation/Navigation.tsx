import { NavLink } from 'react-router-dom';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import OpenModalButton from '../OpenModalButton';
import SignupFormModal from '../SignupFormModal';
import { CiSearch } from 'react-icons/ci';
import { useState, useRef, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';



function Navigation(): JSX.Element {
    const sessionUser = useSelector((state: RootState) => state.session.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);
  
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const closeMenu = () => setShowMenu(false);
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

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener('click', closeMenu);
    }, [showMenu]);
    function submitHandler(e: FormEvent) {
 
    }

    return (
        <nav className="nav-bar">
            <div className="nav-left">
                <NavLink to="/" className="OneMusic-navlink">
                    <img src="https://img.icons8.com/ios_filled/512w/FFFFFF/musical-notes.png" alt="OneMusic logo" className="OneMusic-logo" />
                    <h2 className="OneMusic-title">OneMusic</h2>
                </NavLink>
                
            </div>
            <form className="search-bar-form" onSubmit={(e) => {
                e.preventDefault()
                submitHandler(e)
            }}>
                <div>
                    <input className="song-filter" placeholder="Song Title"onChange={e => {
                        setTitle(e.target.value)
                    }
                    }></input>
                    <input className="artist-filter" placeholder='Song Artist' onChange={e => {
                        setArtist(e.target.value)
                    }
                    }></input>
                    <button type="submit" className="search-bar-form-submit"><CiSearch /></button>
                </div>
            
             
            </form>

            <div className="nav-right">
               
                <div>
                
                        <ProfileButton />
                    
                </div>
                
            </div>
        </nav>
    );
}

export default Navigation;