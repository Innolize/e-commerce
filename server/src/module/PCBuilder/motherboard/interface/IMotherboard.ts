import { Product } from "../../../product/entity/Product";

export interface IMotherboard {
    id: number
    cpu_socket: string
    cpu_brand: string
    ram_version: number
    min_frec: number
    max_frec: number
    video_socket: string
    model_size: string
    watts: number
    product?: Product
}