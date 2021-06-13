import { Product } from "../../../product/entity/Product";

export interface IProcessor {
    cores: number
    frecuency: number
    socket: string
    watts: number
    id_product: number
    id?: number
    product?: Product
}

