import { IVideoCardCreate } from '../interface/IVideoCardCreate'

export class VideoCard {
    id?: number
    version: "DDR4" | "DDR5" | "DDR6"
    memory: number
    clock_speed: number
    watts: number
    id_product?: number
    constructor({ id, id_product, clock_speed, version, memory, watts }: IVideoCardCreate) {
        if (id) {
            this.id = id
        }
        this.version = version,
            this.memory = memory,
            this.clock_speed = clock_speed,
            this.watts = watts
        if (id_product) {
            this.id_product = id_product
        }
    }
}