import { IPlaylist, PlaylistState, IPlaylistActionCreator, IPlaylistForm, IPlaylistId } from './types/playlist'
import { csrfFetch} from "./csrf";
// ============ ACTION TYPES =================
export const GET_ALL_PLAYLISTS = 'playlists/getAllPlaylists';
export const CREATE_PLAYLIST = 'playlists/createPlaylist';
export const GET_ONE_PLAYLIST = 'playlists/getOnePlaylist';
export const UPDATE_PLAYLIST = 'playlists/updatePlaylist';
export const REMOVE_PLAYLIST = 'playlists/removePlaylist';

// ============ ACTION CREATOR =================
const getAllPlaylistsAction = (playlists: IPlaylist[]) => ({
    type: GET_ALL_PLAYLISTS,
    payload: playlists,
});

const createPlaylistAction = (playlist: IPlaylist) => ({
    type: CREATE_PLAYLIST,
    payload: playlist,
});

const getOnePlaylistAction = (playlist: IPlaylist) => ({
    type: GET_ONE_PLAYLIST,
    payload: playlist,
});

const updatePlaylistAction = (playlist: IPlaylist) => ({
    type: UPDATE_PLAYLIST,
    payload: playlist,
});

const removePlaylistAction = (playlistId: IPlaylistId) => ({
    type: REMOVE_PLAYLIST,
    payload: playlistId,
});

// ============ THUNK =================

// Get all playlists
export const thunkGetAllPlaylists = (): any => async (dispatch: any) => {
    try {
     
        
        const response = await csrfFetch('/api/playlist');
        if (response.ok) {
            const data = await response.json();
            dispatch(getAllPlaylistsAction(data));
        } else {
            throw response;
        }
    } catch (e) {
        const err = e as Response;
        const errorMessages = await err.json();
        return errorMessages;
    }
};

// Get one playlist
export const thunkGetOnePlaylist =
    (playlistId: string): any =>
    async (dispatch: any) => {
        try {
            const response = await csrfFetch(`/api/playlist/${playlistId}`);
            if (response.ok) {
                const data = await response.json();
                dispatch(getOnePlaylistAction(data));
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

// Create a new playlist
export const thunkCreatePlaylist =
    (playlistData: IPlaylistForm): any =>
    async (dispatch: any) => {
        try {
            const response = await csrfFetch('/api/playlist/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(playlistData),
            
            });
            if (response.ok) {
                const data = await response.json();
                dispatch(createPlaylistAction(data));
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

// Update a new PLAYLIST
export const thunkUpdatePlaylist =
    (playlistData: IPlaylistForm, playlistId: number | string): any =>
    async (dispatch: any) => {
        try {
            const response = await csrfFetch(`/api/playlist/${playlistId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(playlistData),

            });
            if (response.ok) {
                const data = await response.json();
                dispatch(updatePlaylistAction(data));
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

// Delete a new PLAYLIST
export const thunkRemovePlaylist =
    (playlistId: IPlaylistId): any =>
    async (dispatch: any) => {
        try {
            const response = await csrfFetch(`/api/playlist/${playlistId.id}`, {
                method: 'DELETE',
                headers: { "Content-Type": "application/json" }
            });
            if (response.ok) {
                const data = await response.json();
                dispatch(removePlaylistAction(playlistId));
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
const initialState: PlaylistState = {
    byId: {},
    allPlaylists: [],
};

export default function playlistReducer(
    state = initialState,
    action: IPlaylistActionCreator,
): PlaylistState {
    let newState = {
        ...state,
    };
    let newById = { ...newState.byId };
    let allPlaylist = [...newState.allPlaylists];
    

    switch (action.type) {
        case GET_ALL_PLAYLISTS:
            if (Array.isArray(action.payload)) {
                const playlists = action.payload;
                playlists.forEach((b: IPlaylist) => {
                    newById[b.id] = b;
                });
                allPlaylist = action.payload;

                newState.byId = newById;
                newState.allPlaylists = allPlaylist;
                return newState;
            }
            return state;

        case GET_ONE_PLAYLIST:
            if (!Array.isArray(action.payload)) {
            
                const playlist = action.payload;
                
                newById[playlist.id] = playlist;

                newState.byId = newById
                newState.allPlaylists = [playlist];

                return newState;
            }
            return state;

        case CREATE_PLAYLIST:
            if (!Array.isArray(action.payload)) {
                const newPlaylist = action.payload;
                newState.allPlaylists = [...newState.allPlaylists, newPlaylist];
                newState.byId = { ...newState.byId, [newPlaylist.id]: newPlaylist };

                return newState;
            }
            return state;
        case UPDATE_PLAYLIST:
            const newPlaylist = action.payload as IPlaylist;
            const index = allPlaylist.findIndex(b => b.id === newPlaylist.id);
            if (index !== -1) {
                newState.allPlaylists[index] = newPlaylist;
            } else return state;
            return newState;
        case REMOVE_PLAYLIST:
            const playlistId = action.payload as IPlaylistId;
            newState.allPlaylists = newState.allPlaylists.filter(b => b.id !== playlistId.id);
            return newState;
        default:
            return state;
    }
}
