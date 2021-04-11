import { Product } from "../../../product/entity/Product";

export interface IVideoCard {
    id: number,
    version: "DDR4" | "DDR5" | "DDR6"
    memory: number
    clock_speed: number
    watts: number
    product?: Product
}

