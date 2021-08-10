import { CartItem } from '../entities/CartItem'

export interface ICart {
    id: number,
    user_id: number,
    cartItems?: CartItem[]
}