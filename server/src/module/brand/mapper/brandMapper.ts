import { Brand } from "../entity/Category"
import { BrandModel } from "../model/brandModel"

export const fromDbToBrand = (model: BrandModel): Brand => {
    return new Brand(model.toJSON() as Brand)
}