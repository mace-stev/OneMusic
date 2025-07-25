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