export type spotifyPlaylist = {
    href: string;
    name: string;
    image: string;
}
export type SpotifyPlaylistResource = {
    collaborative: boolean;
    description: string;
    external_urls: Record<string,string>[];
    followers: {href: string, total:number};
    href: string;
    id: string;
    images: {height: number, url: string}[];
    name: string;
    owner: {display_name: string, external_urls: Record<string,string>[]}
    primary_color: string | null;
    public: boolean;
    snapshot_id: string;
    tracks: SpotifyPlaylistItems;
    type: string;
    url: string;

}
export type SpotifyPlaylistItems = {
    href: string;
    items: SpotifyPlaylistItem[];
    limit: number;
    next: string;
    offset: number;
    previous: string | null;
    total: number
}
export type SpotifyPlaylistItem={
    added_at: string;
    added_by: {external_urls: Record<string,string>[], href: string, id: string, type: string, url: string }
    is_local: boolean;
    primary_color: string | null;
    track: SpotifyPlaylistTrack;
}

export type SpotifyPlaylistArtist={
    external_urls: Record<string,string>[];
    href: string;
    id: string;
    name: string;
    type: string;
    url: string;
}

export interface SpotifyPlaylistTrack {
  preview_url: string | null;
  available_markets: string[];
  explicit: boolean;
  type: "track";
  episode: boolean;
  track: boolean;
  album: {
    available_markets: string[];
    type: "album";
    album_type: "album" | "single" | "compilation" | string;
    href: string;
    id: string;
    images: Array<{
      url: string;
      width: number;
      height: number;
    }>;
    name: string;
    release_date: string; // YYYY‑MM‑DD or YYYY‑MM depending on precision
    release_date_precision: "year" | "month" | "day";
    uri: string;
    artists: SpotifyPlaylistArtist;
    external_urls: { spotify: string };
    total_tracks: number;
  };
  artists: Array<{
    external_urls: { spotify: string };
    href: string;
    id: string;
    name: string;
    type: "artist";
    uri: string;
  }>;
  disc_number: number;
  track_number: number;
  duration_ms: number;
  external_ids: {
    isrc?: string;
  };
  external_urls: { spotify: string };
  href: string;
  id: string;
  name: string;
  popularity: number;
  uri: string;
  is_local: boolean;
}
export type FilteredSpotifyTrack={
    id?: string;
    title: string;
    artist: string;
    previewId: string;
}
