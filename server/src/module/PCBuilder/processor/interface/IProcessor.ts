import { Product } from "../../../product/entity/Product";

export interface IProcessor {
    id: number,
    cores: number,
    socket: string,
    frecuency: number,
    watts: number,
    product?: Product
}

