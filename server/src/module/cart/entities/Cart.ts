import { CartItem } from "./CartItem";
import { ICart } from '../interface/ICart'

export class Cart implements ICart {
    constructor(
        public user_id: number,
        public active: boolean = false,
        public cartItems?: CartItem[],
        public id?: number,
    ) { }
}