import { Brand } from "../entity/Brand"
import { IBrand } from "../interfaces/IBrand"
import { IBrandCreate } from "../interfaces/IBrandCreate"

export const fromDbToBrand = (model: IBrand): Brand => {
    const { logo, name, id } = model
    return new Brand(name, logo, id)
}

export const fromRequestToBrand = (request: IBrandCreate): Brand => {
    const { logo, id, name } = request
    return new Brand(name, logo, id)
}