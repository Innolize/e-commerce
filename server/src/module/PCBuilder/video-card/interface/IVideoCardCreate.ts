import { VIDEO_CARD_VERSION } from "../../../../config/constants/pcbuilder";
import { IProductCreate } from "../../../product/interfaces/IProductCreate";

export interface IVideoCard_Product extends IVideoCardCreate, IProductCreate { }

export interface IVideoCardCreate {
    id?: number,
    version: typeof VIDEO_CARD_VERSION[number]
    memory: number
    clock_speed: number
    watts: number
    id_product?: number
}