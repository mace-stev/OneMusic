

export interface IPlaylist {
    id: number;
    name: string;
    ownerId: number;
    previewId?: string;
    Image?:{
        id: number;
        url: string;
    };
    Songs?:{
        Image?:{
            id: number;
            url: string;
        }
        artist: string;
        id: number;
        title: string;
    }[]
    
}

export interface IPlaylistForm {
    name: string;
    previewId?: number | null
}

export interface IPlaylistId {
    id: number
}

export interface PlaylistState {
    byId: PlaylistId;
    allPlaylists: IPlaylist[];
}

export interface IPlaylistActionCreator {
    type: string;
    payload: IPlaylist | IPlaylist[];
}

export interface ValidationErrors {
    name?: string;
    previewId?: string;
}



