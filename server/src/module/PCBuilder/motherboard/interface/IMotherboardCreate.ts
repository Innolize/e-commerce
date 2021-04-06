import { ICreateProduct } from '../../../product/interfaces/ICreateProduct'

export interface IMotherboard_Product extends IMotherboardCreate, ICreateProduct { }

export interface IMotherboardCreate {
    id?: number
    cpu_socket: string
    cpu_brand: string
    ram_version: number
    min_frec: number
    max_frec: number
    video_socket: string
    model_size: string
    watts: number
    id_product?: number
}