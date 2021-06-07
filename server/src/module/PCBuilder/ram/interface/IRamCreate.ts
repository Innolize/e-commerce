import { RAM_VERSION } from "../../../../config/constants/pcbuilder";
import { IProductCreate } from "../../../product/interfaces/IProductCreate";

export interface IRam_Product extends IRamCreate, IProductCreate { }

export interface IRamCreate {
    id?: number,
    ram_version: typeof RAM_VERSION[number],
    memory: number,
    min_frec: number,
    max_frec: number,
    watts: number,
    id_product: number
}