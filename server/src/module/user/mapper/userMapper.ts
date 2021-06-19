import { fromDbToRole } from "../../authorization/mapper/roleMapper"
import { fromDbToCart } from "../../cart/mapper/cartMapper"
import { User } from "../entities/User"
import { IUser } from "../interfaces/IUser"
import { IUserCreate } from "../interfaces/IUserCreate"

export const fromDbToUser = (model: IUser): User => {
    const { mail, id, password, role_id, role, cart } = model
    const userRole = role ? fromDbToRole(role) : undefined
    const currentCart = cart ? fromDbToCart(cart) : undefined
    return new User(mail, password, role_id, id, currentCart, userRole)
}

export const fromRequestToUser = (request: IUserCreate): User => {
    const { mail, role_id, password, id } = request
    return new User(mail, password, role_id, id || undefined)
}