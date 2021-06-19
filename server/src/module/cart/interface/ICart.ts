import { CartItem } from '../entities/CartItem'

export interface ICart {
    user_id: number,
    total: number,
    cartItems?: CartItem[],
    id?: number,
}