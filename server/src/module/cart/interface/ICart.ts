import { CartItem } from '../entities/CartItem'

export interface ICart {
    user_id: number,
    active: boolean,
    cartItems?: CartItem[],
    id?: number,
}