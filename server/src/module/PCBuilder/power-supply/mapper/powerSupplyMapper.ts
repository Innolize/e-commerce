import { PowerSupply } from "../entities/PowerSupply"
import { IPowerSupplyCreate } from '../interface/IPowerSupplyCreate'
import { fromDbToProduct } from "../../../product/mapper/productMapper"
import { IPowerSupply } from "../interface/IPowerSupply"

export const fromDbToPowerSupply = (model: IPowerSupply): PowerSupply => {
    const { certification, watts, id, id_product, product } = model
    const powerSupplyProduct = product ? fromDbToProduct(product) : undefined
    return new PowerSupply(watts, certification, id_product, id, powerSupplyProduct)
}

export const fromRequestToPowerSupply = (request: IPowerSupplyCreate): PowerSupply => {
    const { certification, watts, id_product, id } = request
    return new PowerSupply(watts, certification, id_product, id)
}