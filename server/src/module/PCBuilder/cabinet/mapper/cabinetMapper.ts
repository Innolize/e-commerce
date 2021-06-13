import { Cabinet } from "../entities/Cabinet"
import { ICabinetCreate } from '../interface/ICabinetCreate'
import { fromRequestToProduct } from "../../../product/mapper/productMapper"
import { ICabinet } from "../interface/ICabinet"

export const fromDbToCabinet = (model: ICabinet): Cabinet => {
    const { generic_pws, size, id, id_product, product } = model
    const cabinetProduct = product ? fromRequestToProduct(product) : undefined
    return new Cabinet(size, generic_pws, id_product, id, cabinetProduct)
}

export const fromRequestToCabinet = (request: ICabinetCreate): Cabinet => {
    const { generic_pws, id, size, id_product } = request
    return new Cabinet(size, generic_pws, id_product, id)
}