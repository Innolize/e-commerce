import { PowerSupply } from "../entities/PowerSupply"
import { PowerSupplyModel } from "../model/PowerSupplyModel"
import { IPowerSupplyCreate } from '../interface/IPowerSupplyCreate'
import { fromRequestToProduct } from "../../../product/mapper/productMapper"

export const fromDbToPowerSupply = (model: PowerSupplyModel): PowerSupply => {
    const powerSupply = model.toJSON() as PowerSupply
    const { certification, watts, id, id_product, product } = powerSupply
    const powerSupplyProduct = product ? fromRequestToProduct(product) : undefined
    return new PowerSupply(watts, certification, id, id_product, powerSupplyProduct)
}

export const fromRequestToPowerSupply = (request: IPowerSupplyCreate): PowerSupply => {
    const { certification, watts, id_product, id } = request
    return new PowerSupply(watts, certification, id, id_product)
}