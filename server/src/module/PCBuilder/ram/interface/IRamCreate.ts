import { IProductCreate } from "../../../product/interfaces/IProductCreate";

export interface IRam_Product extends IRamCreate, IProductCreate { }

export interface IRamCreate {
    id?: number,
    ram_version: "DDR1" | "DDR2" | "DDR3" | "DDR4",
    memory: number,
    min_frec: number,
    max_frec: number,
    watts: number,
    id_product?: number
}