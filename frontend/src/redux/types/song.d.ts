

export interface ISong {
    id: number;
    title: string;
    playlistId: number;
    artist: string;
    previewId?: string | null;
    Image:{
            id: number;
            url: string;
        }
    
}

export interface ISongForm {
    id: number;
    previewId: number | undefined;
}

export interface ISongId {
    id: number
    playlistId?: number
}

export interface SongState {
    byId: SongId;
    allSongs: ISong[];
}

export interface ISongActionCreator {
    type: string;
    payload: ISong | ISong[];
}

export interface ValidationErrors {
    title: string;
    playlistId: number;
    artist: string;
    previewId?: string | null;
}
export interface IFilteredSong{
    title: string;
    artist: string;
}