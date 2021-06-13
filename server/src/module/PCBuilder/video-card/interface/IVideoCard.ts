import { VIDEO_CARD_VERSION } from "../../../../config/constants/pcbuilder";
import { Product } from "../../../product/entity/Product";

export interface IVideoCard {
    version: typeof VIDEO_CARD_VERSION[number],
    memory: number,
    clock_speed: number,
    watts: number,
    id_product: number,
    id?: number,
    product?: Product
}

