import { Processor } from "../entities/Processor"
import { IProcessorCreate } from '../interface/IProcessorCreate'
import { fromDbToProduct } from "../../../product/mapper/productMapper"
import { IProcessor } from "../interface/IProcessor"

export const fromDbToProcessor = (model: IProcessor): Processor => {
    const { cores, id, id_product, watts, product, frecuency, socket } = model
    const processorProduct = product ? fromDbToProduct(product) : undefined
    return new Processor(cores, frecuency, socket, watts, id_product, id, processorProduct)
}

export const fromRequestToProcessor = (request: IProcessorCreate): Processor => {
    const { cores, socket, frecuency, watts, id_product, id } = request
    return new Processor(cores, frecuency, socket, watts, id_product, id)
}