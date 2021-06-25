import { Role } from "../../authorization/entities/Role";
import { Cart } from "../../cart/entities/Cart";

export interface IUser {
    id: number
    mail: string
    password: string
    role_id: number
    cart?: Cart
    // public orders: Orders[]
    role?: Role
}