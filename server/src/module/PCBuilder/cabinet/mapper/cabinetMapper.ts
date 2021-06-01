import { Cabinet } from "../entities/Cabinet"
import { CabinetModel } from "../model/CabinetModel"
import { ICabinetCreate } from '../interface/ICabinetCreate'
import { fromDbToUser } from "../../../user/mapper/userMapper"
import { ICabinet } from "../interface/ICabinet"
import { fromRequestToProduct } from "../../../product/mapper/productMapper"

export const fromDbToCabinet = (model: CabinetModel): Cabinet => {
    const cabinet = model.toJSON() as Cabinet
    const { generic_pws, size, id, id_product, product } = cabinet
    const cabinetProduct = product ? fromRequestToProduct(product) : undefined
    return new Cabinet(size, generic_pws, id_product, id, cabinetProduct)
}

export const fromRequestToCabinet = (request: ICabinetCreate): Cabinet => {
    const { generic_pws, id, size, id_product } = request
    return new Cabinet(size, generic_pws, id_product, id)
}