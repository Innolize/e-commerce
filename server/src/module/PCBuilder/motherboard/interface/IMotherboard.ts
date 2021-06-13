import { CPU_BRANDS, RAM_VERSION, SIZE, VIDEO_CARD_VERSION } from "../../../../config/constants/pcbuilder";
import { Product } from "../../../product/entity/Product";

export interface IMotherboard {
    cpu_socket: string,
    cpu_brand: typeof CPU_BRANDS[number],
    ram_version: typeof RAM_VERSION[number],
    min_frec: number,
    max_frec: number,
    video_socket: typeof VIDEO_CARD_VERSION[number],
    model_size: typeof SIZE[number],
    watts: number,
    id_product: number,
    id?: number,
    product?: Product
}