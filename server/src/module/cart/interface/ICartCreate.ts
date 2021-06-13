import { CartItem } from "../entities/CartItem";

export interface ICartCreate {
    user_id: number,
    active?: boolean,
    cartItems?: CartItem[],
    id?: number,
}