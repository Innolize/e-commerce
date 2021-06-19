import { CartItem } from "./CartItem";
import { ICart } from '../interface/ICart'

export class Cart implements ICart {
    constructor(
        public user_id: number,
        public total: number = 0,
        public id?: number,
        public cartItems?: CartItem[],
    ) { }
}