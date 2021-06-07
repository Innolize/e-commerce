import { Processor } from "../entities/Processor"
import { ProcessorModel } from "../model/ProcessorModel"
import { IProcessorCreate } from '../interface/IProcessorCreate'
import { fromRequestToProduct } from "../../../product/mapper/productMapper"

export const fromDbToProcessor = (model: ProcessorModel): Processor => {
    const processor = model.toJSON() as Processor
    const { cores, id, id_product, watts, product, frecuency, socket } = processor
    const processorProduct = product ? fromRequestToProduct(product) : undefined
    return new Processor(cores, frecuency, socket, watts, id, id_product, processorProduct)
}

export const fromRequestToProcessor = (request: IProcessorCreate): Processor => {
    const { cores, socket, frecuency, watts, id_product, id } = request
    return new Processor(cores, frecuency, socket, watts, id, id_product)
}