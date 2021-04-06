import { IRamCreate } from '../interface/IRamCreate'

export class Ram {
    id?: number
    ram_version: "DDR1" | "DDR2" | "DDR3" | "DDR4"
    memory: number
    min_frec: number
    max_frec: number
    watts: number
    id_product?: number
    constructor({ id, id_product, max_frec, memory, min_frec, ram_version, watts }: IRamCreate) {
        if (id) {
            this.id = id
        }
        this.ram_version = ram_version,
            this.min_frec = min_frec,
            this.max_frec = max_frec,
            this.memory = memory,
            this.watts = watts
        if (id_product) {
            this.id_product = id_product
        }
    }
}