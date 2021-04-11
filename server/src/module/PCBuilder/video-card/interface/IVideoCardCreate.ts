import { IProductCreate } from "../../../product/interfaces/IProductCreate";

export interface IVideoCard_Product extends IVideoCardCreate, IProductCreate { }

export interface IVideoCardCreate {
    id?: number,
    version: "DDR4" | "DDR5" | "DDR6"
    memory: number
    clock_speed: number
    watts: number
    id_product?: number
}