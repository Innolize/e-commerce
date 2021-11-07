import { Ram } from "../entities/Ram"
import { RamModel } from "../model/ramModel"
import { IRamCreate, IRam_Product } from '../interface/IRamCreate'
import { fromDbToProduct } from "../../../product/mapper/productMapper"

export const fromDbToRam = (model: RamModel): Ram => {
    const ram = model.toJSON() as Ram
    const { max_frec, id, id_product, watts, product, memory, min_frec, ram_version } = ram
    const ramProduct = product ? fromDbToProduct(product) : undefined
    return new Ram(ram_version, memory, min_frec, max_frec, watts, id_product, id, ramProduct)
}

export const fromRequestToRamCreate = (request: IRam_Product): IRamCreate => {
    const { max_frec, memory, min_frec, watts, ram_version, product } = request
    return { max_frec, memory, min_frec, watts, ram_version, product }
}