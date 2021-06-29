import { CartItem } from '../entities/CartItem'

export interface ICart {
    user_id: number,
    cartItems?: CartItem[],
    id?: number,
}