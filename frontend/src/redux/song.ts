import { ISong, SongState, ISongActionCreator, ISongForm, ISongId, IFilteredSong } from './types/song'
import { csrfFetch } from "./csrf";
// ============ ACTION TYPES =================
export const GET_ALL_SONGS = 'Songs/getAllSongs';
export const CREATE_SONG = 'Songs/createSong';
export const GET_ONE_SONG = 'Songs/getOneSong';
export const UPDATE_SONG = 'Songs/updateSong';
export const REMOVE_SONG = 'Songs/removeSong';

// ============ ACTION CREATOR =================
const getAllSongsAction = (Songs: ISong[]) => ({
    type: GET_ALL_SONGS,
    payload: Songs,
});

const createSongAction = (Song: ISong) => ({
    type: CREATE_SONG,
    payload: Song,
});

const getOneSongAction = (Song: ISong) => ({
    type: GET_ONE_SONG,
    payload: Song,
});

const updateSongAction = (Song: ISong) => ({
    type: UPDATE_SONG,
    payload: Song,
});

const removeSongAction = (SongId: ISongId) => ({
    type: REMOVE_SONG,
    payload: SongId,
});

// ============ THUNK =================

// Get all Songes
export const thunkGetAllSongs = (songFilters: IFilteredSong): any => async (dispatch: any) => {
    try {
        const url = new URL('/api/song', window.location.origin);
        if(songFilters.title){
            url.searchParams.set('title', songFilters.title);

        }
           if(songFilters.artist){
            url.searchParams.set('artist', songFilters.artist);
        }
     
        const response = await csrfFetch(`${url}`);
        if (response.ok) {
            const data = await response.json();
            dispatch(getAllSongsAction(data));
        } else {
            throw response;
        }
    } catch (e) {
        const err = e as Response;
        const errorMessages = await err.json();
        return errorMessages;
    }
};

// Get one Song
export const thunkGetOneSong =
    (songId: string): any =>
    async (dispatch: any) => {
        try {
            const response = await fetch(`/api/song/${songId}`);
            if (response.ok) {
                const data = await response.json();
                dispatch(getOneSongAction(data));
                return data;
            } else {
                throw response;
            }
        } catch (e) {
            const err = e as Response;
            const errorMessages = await err.json();
            return errorMessages;
        }
    };

// Create a new Song
export const thunkCreateSong =
    (songData: ISongForm): any =>
    async (dispatch: any) => {
        try {
            const response = await csrfFetch('/api/song/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(songData),
              
            });
            if (response.ok) {
                const data = await response.json();
                dispatch(createSongAction(data));
                return data;
            } else {
                throw response;
            }
        } catch (e) {
            const err = e as Response;
            const errorMessages = await err.json();
            return errorMessages;
        }
    };

// Update a new Song
export const thunkUpdateSong =
    (songData: ISongForm, songId: number | string): any =>
    async (dispatch: any) => {
        try {
            const response = await csrfFetch(`/api/song/${songId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(songData),
            });
            if (response.ok) {
                const data = await response.json();
                dispatch(updateSongAction(data));
                return data;
            } else {
                throw response;
            }
        } catch (e) {
            const err = e as Response;
            const errorMessages = await err.json();
            return errorMessages;
        }
    };

// Delete a new Song
export const thunkRemoveSong =
    (songId: ISongId): any =>
    async (dispatch: any) => {
        try {
            const response = await csrfFetch(`/api/song/${songId}`, {
                method: 'DELETE',
                headers: { "Content-Type": "application/json" }
             
            });
            if (response.ok) {
                const data = await response.json();
                dispatch(removeSongAction(songId));
                return data;
            } else {
                throw response;
            }
        } catch (e) {
            const err = e as Response;
            const errorMessages = await err.json();
            return errorMessages;
        }
    };

// ============ REDUCER =================
const initialState: SongState = {
    byId: {},
    allSongs: [],
};

export default function SongReducer(
    state = initialState,
    action: ISongActionCreator,
): SongState {
    let newState = {
        ...state,
    };
    let newById = { ...newState.byId };
    let allSong = [...newState.allSongs];

    switch (action.type) {
        case GET_ALL_SONGS:
            if (Array.isArray(action.payload)) {
                const Songs = action.payload;
                Songs.forEach((b: ISong) => {
                    newById[b.id] = b;
                });
                allSong = action.payload;

                newState.byId = newById;
                newState.allSongs = allSong;
                return newState;
            }
            return state;

        case GET_ONE_SONG:
            if (!Array.isArray(action.payload)) {
                const Song = action.payload;
                newById[Song.id] = Song;

                newState.byId = { ...newState.byId, [Song.id]: Song};
                newState.allSongs = [...newState.allSongs, Song];

                return newState;
            }
            return state;

        case CREATE_SONG:
            if (!Array.isArray(action.payload)) {
                const newSong = action.payload;
                newState.allSongs = [...newState.allSongs, newSong];
                newState.byId = { ...newState.byId, [newSong.id]: newSong };

                return newState;
            }
            return state;
        case UPDATE_SONG:
            const newSong = action.payload as ISong;
            const index = allSong.findIndex(b => b.id === newSong.id);
            if (index !== -1) {
                newState.allSongs[index] = newSong;
            } else return state;
            return newState;
        case REMOVE_SONG:
            const SongId = action.payload as ISongId;
            newState.allSongs = newState.allSongs.filter(b => b.id !== SongId.id);
            return newState;
        default:
            return state;
    }
}
