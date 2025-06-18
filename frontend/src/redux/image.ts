import { IImage, ImageState, IImageActionCreator, IImageForm, IImageId } from './types/image'
import { csrfFetch } from "./csrf";
// ============ ACTION TYPES =================
export const GET_ALL_IMAGES = 'Images/getAllImages';
export const CREATE_IMAGE = 'Images/createImage';
export const GET_ONE_IMAGE = 'Images/getOneImage';
export const UPDATE_IMAGE = 'Images/updateImage';
export const REMOVE_IMAGE = 'Images/removeImage';

// ============ ACTION CREATOR =================
const getAllImagesAction = (Images: IImage[]) => ({
    type: GET_ALL_IMAGES,
    payload: Images,
});

const createImageAction = (Image: IImage) => ({
    type: CREATE_IMAGE,
    payload: Image,
});

const getOneImageAction = (Image: IImage) => ({
    type: GET_ONE_IMAGE,
    payload: Image,
});

const updateImageAction = (Image: IImage) => ({
    type: UPDATE_IMAGE,
    payload: Image,
});

const removeImageAction = (ImageId: IImageId) => ({
    type: REMOVE_IMAGE,
    payload: ImageId,
});

// ============ THUNK =================

// Get all Imagees
export const thunkGetAllImages = (): any => async (dispatch: any) => {
    try {
   
        const response = await csrfFetch('/api/images');
        if (response.ok) {
            const data = await response.json();
            dispatch(getAllImagesAction(data));
        } else {
            throw response;
        }
    } catch (e) {
        const err = e as Response;
        const errorMessages = await err.json();
        return errorMessages;
    }
};

// Get one Image
export const thunkGetOneImage =
    (ImageId: string): any =>
    async (dispatch: any) => {
        try {
            const response = await fetch(`/api/images/${ImageId}`);
            if (response.ok) {
                const data = await response.json();
                dispatch(getOneImageAction(data));
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

// Create a new Image
export const thunkCreateImage =
    (ImageData: IImageForm): any =>
    async (dispatch: any) => {
        try {
            const response = await csrfFetch('/api/images/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ImageData),
              
            });
            if (response.ok) {
                const data = await response.json();
                dispatch(createImageAction(data));
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

// Update a new Image
export const thunkUpdateImage =
    (ImageData: IImageForm, ImageId: number | string): any =>
    async (dispatch: any) => {
        try {
            const response = await csrfFetch(`/api/images/${ImageId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ImageData),
            });
            if (response.ok) {
                const data = await response.json();
                dispatch(updateImageAction(data));
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

// Delete a new Image
export const thunkRemoveImage =
    (ImageId: IImageId): any =>
    async (dispatch: any) => {
        try {
            const response = await csrfFetch(`/api/images/${ImageId.id}`, {
                method: 'DELETE',
                headers: { "Content-Type": "application/json" }
             
            });
            if (response.ok) {
                const data = await response.json();
                dispatch(removeImageAction(ImageId));
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
const initialState: ImageState = {
    byId: {},
    allImages: [],
};

export default function ImageReducer(
    state = initialState,
    action: IImageActionCreator,
): ImageState {
    let newState = {
        ...state,
    };
    let newById = { ...newState.byId };
    let allImage = [...newState.allImages];

    switch (action.type) {
        case GET_ALL_IMAGES:
            if (Array.isArray(action.payload)) {
                const Images = action.payload;
                Images.forEach((b: IImage) => {
                    newById[b.id] = b;
                });
                allImage = action.payload;

                newState.byId = newById;
                newState.allImages = allImage;
                return newState;
            }
            return state;

        case GET_ONE_IMAGE:
            if (!Array.isArray(action.payload)) {
                const Image = action.payload;
                newById[Image.id] = Image;

                newState.byId = { ...newState.byId, [Image.id]: Image};
                newState.allImages = [...newState.allImages, Image];

                return newState;
            }
            return state;

        case CREATE_IMAGE:
            if (!Array.isArray(action.payload)) {
                const newImage = action.payload;
                newState.allImages = [...newState.allImages, newImage];
                newState.byId = { ...newState.byId, [newImage.id]: newImage };

                return newState;
            }
            return state;
        case UPDATE_IMAGE:
            const newImage = action.payload as IImage;
            const index = allImage.findIndex(b => b.id === newImage.id);
            if (index !== -1) {
                newState.allImages[index] = newImage;
            } else return state;
            return newState;
        case REMOVE_IMAGE:
            const ImageId = action.payload as IImageId;
            newState.allImages = newState.allImages.filter(b => b.id !== ImageId.id);
            return newState;
        default:
            return state;
    }
}
