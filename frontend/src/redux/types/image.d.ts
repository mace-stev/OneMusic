import { Url } from "url";

export interface IImage {
    id: number;
    url: string;
    
}

export interface IImageForm {
    url: string;
}

export interface IImageId {
    id: number
}

export interface ImageState {
    byId: ImageId;
    allImages: IImage[];
}

export interface IImageActionCreator {
    type: string;
    payload: IImage | IImage[];
}

export interface ValidationErrors {
    title: Url;
}
