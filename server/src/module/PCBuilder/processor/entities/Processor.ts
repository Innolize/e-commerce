import { IProcessorCreate } from '../interface/IProcessorCreate'

export class Processor {
    static readonly modelName = 'Processor'
    id?: number
    cores: number
    frecuency: number
    socket: number
    watts: number
    id_product?: number
    constructor({ id, id_product, cores, frecuency, socket, watts }: IProcessorCreate) {
        if (id) {
            this.id = id
        }
        this.cores = cores,
            this.frecuency = frecuency,
            this.socket = socket,
            this.watts = watts
        if (id_product) {
            this.id_product = id_product
        }
    }
}