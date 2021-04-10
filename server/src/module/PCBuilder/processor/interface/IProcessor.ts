import { Product } from "../../../product/entity/Product";

export interface IProcessor {
    id: number,
    cores: number,
    socket: number,
    frecuency: number,
    watts: number,
    product?: Product
}

