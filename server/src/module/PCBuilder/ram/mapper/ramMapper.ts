import { Ram } from "../entities/Ram"
import { RamModel } from "../model/ramModel"
import { IRamCreate } from '../interface/IRamCreate'
import { fromDbToProduct } from "../../../product/mapper/productMapper"

export const fromDbToRam = (model: RamModel): Ram => {
    const ram = model.toJSON() as Ram
    const { max_frec, id, id_product, watts, product, memory, min_frec, ram_version } = ram
    const ramProduct = product ? fromDbToProduct(product) : undefined
    return new Ram(ram_version, memory, min_frec, max_frec, watts, id_product, id, ramProduct)
}

export const fromRequestToRam = (request: IRamCreate): Ram => {
    const { max_frec, id_product, id, memory, min_frec, ram_version, watts } = request
    return new Ram(ram_version, memory, min_frec, max_frec, watts, id_product, id)
}