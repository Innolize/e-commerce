import { PowerSupply } from "../entities/PowerSupply"
import { fromDbToProduct } from "../../../product/mapper/productMapper"
import { IPowerSupply } from "../interface/IPowerSupply"
import { IPowerSupplyCreate, IPowerSupply_Product } from "../interface/IPowerSupplyCreate"

export const fromDbToPowerSupply = (model: IPowerSupply): PowerSupply => {
    const { certification, watts, id, id_product, product } = model
    const powerSupplyProduct = product ? fromDbToProduct(product) : undefined
    return new PowerSupply(watts, certification, id_product, id, powerSupplyProduct)
}

export const fromRequestToPowerSupplyCreate = (request: IPowerSupply_Product): IPowerSupplyCreate => {
    const { certification, watts, product } = request
    return { certification, watts, product }
}