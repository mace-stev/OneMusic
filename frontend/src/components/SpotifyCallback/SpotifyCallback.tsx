import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SpotifyCallback() {
  const nav = useNavigate();

  useEffect(() => {
    
    const p        = new URLSearchParams(window.location.search);
    const code     = p.get('code');
    const gotState = p.get('state');
    const wantState = localStorage.getItem('spotify_state');
    const verifier  = localStorage.getItem('spotify_code_verifier');

    if (code && gotState === wantState && verifier) {
     
      fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type':'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type:    'authorization_code',
          code,
          redirect_uri:  import.meta.env.VITE_SPOTIFY_REDIRECT_URL,
          client_id:     import.meta.env.VITE_SPOTIFY_CLIENT_ID,
          code_verifier: verifier,
        })
      })
      .then(r => r.json())
      .then(response => {
        if (response.access_token) {
              localStorage.removeItem('access_token');
          localStorage.setItem('spotify_access_token', response.access_token);
        }
      
        localStorage.removeItem('spotify_code_verifier');
        localStorage.removeItem('spotify_state');
      })
      .finally(() => {
       
        nav('/');
      });
    } else {
      nav('/');
    }
  }, [nav]);

  return null; 
}