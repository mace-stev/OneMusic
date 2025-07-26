export const generateRandomString = (length: number) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

export const codeVerifier: string  = generateRandomString(128);

export const sha256 = async (plain: string) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  return window.crypto.subtle.digest('SHA-256', data)
}
export const base64encode = (input: ArrayBuffer) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}
export async function spotifySignIn() {
  
  const verifier = generateRandomString(128);
  localStorage.setItem("spotify_code_verifier", verifier);

  const state = generateRandomString(16);
  localStorage.setItem("spotify_state", state);

  const hashed = await sha256(verifier);
  const challenge = base64encode(hashed);
console.log("Outgoing Spotify redirect_uri:", import.meta.env.VITE_SPOTIFY_REDIRECT_URL);
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_SPOTIFY_REDIRECT_URL,
    scope: "playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public ugc-image-upload user-read-email",
    code_challenge_method: 'S256',
    code_challenge: challenge,
    state,               
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params}`;
}