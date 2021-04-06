import { IMotherboardCreate } from '../interface/IMotherboardCreate'

export class Motherboard {
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
    constructor({ id, cpu_socket, cpu_brand, ram_version, min_frec, max_frec, video_socket, model_size, watts, id_product }: IMotherboardCreate) {
        if (id) {
            this.id = id
        }
        this.cpu_socket = cpu_socket,
            this.cpu_brand = cpu_brand,
            this.ram_version = ram_version,
            this.min_frec = min_frec,
            this.max_frec = max_frec,
            this.video_socket = video_socket,
            this.model_size = model_size,
            this.watts = watts
        if (id_product) {
            this.id_product = id_product
        }

    }
}