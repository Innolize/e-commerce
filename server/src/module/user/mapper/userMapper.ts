import { fromDbToRole } from "../../authorization/mapper/roleMapper"
import { fromDbToCart } from "../../cart/mapper/cartMapper"
import { User } from "../entities/User"
import { IUser } from "../interfaces/IUser"

export const fromDbToUser = (model: IUser): User => {
    const { mail, id, password, role_id, role, cart } = model
    const userRole = role ? fromDbToRole(role) : undefined
    const currentCart = cart ? fromDbToCart(cart) : undefined
    return new User(id, mail, password, role_id, currentCart, userRole)
}

// export const fromRequestToUser = (request: IUserCreate): User => {
//     const { mail, role_id, password } = request
//     return new User(mail, password, role_id)
// }