import { CartItem } from "./CartItem";
import { ICart } from '../interface/ICart'
import { CartError } from "../error/CartError";

export class Cart implements ICart {
    static readonly modelName = 'Cart'
    constructor(
        public id: number,
        public user_id: number,
        public cartItems?: CartItem[]
    ) { }
}
