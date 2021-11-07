import { Processor } from "../entities/Processor"
import { IProcessorCreate, IProcessor_Product } from '../interface/IProcessorCreate'
import { fromDbToProduct } from "../../../product/mapper/productMapper"
import { IProcessor } from "../interface/IProcessor"

export const fromDbToProcessor = (model: IProcessor): Processor => {
    const { cores, id, id_product, watts, product, frecuency, socket } = model
    const processorProduct = product ? fromDbToProduct(product) : undefined
    return new Processor(cores, frecuency, socket, watts, id_product, id, processorProduct)
}

export const fromRequestToProcessorCreate = (request: IProcessor_Product): IProcessorCreate => {
    const { frecuency, cores, socket, watts, product } = request
    return { frecuency, cores, socket, watts, product }
}