import { Brand } from "../entity/Brand"
import { IBrandCreate } from "../interfaces/IBrandCreate"
import { BrandModel } from "../model/brandModel"

export const fromDbToBrand = (model: BrandModel): Brand => {
    const brand = model.toJSON() as Brand
    const { logo, name, id } = brand
    return new Brand(name, logo, id)
}

export const fromRequestToBrand = (request: IBrandCreate): Brand => {
    const { logo, id, name } = request
    return new Brand(name, logo, id)
}