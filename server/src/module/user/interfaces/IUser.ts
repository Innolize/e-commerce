import { Role } from "../../authorization/entities/Role";
import { Cart } from "../../cart/entities/Cart";

export interface IUser {
    mail: string
    password: string
    role_id: number
    id?: number
    cart?: Cart
    // public orders: Orders[]
    role?: Role
}