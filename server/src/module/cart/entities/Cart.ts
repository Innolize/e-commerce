import { CartItem } from "./CartItem";
import { ICart } from '../interface/ICart'
import { CartError } from "../error/CartError";

export class Cart implements ICart {
    static readonly modelName = 'Cart'
    constructor(
        public user_id: number,
        public total: number = 0,
        public id?: number,
        public cartItems?: CartItem[],
    ) { }

    calculateAndUpdateTotal(): Cart {
        if (!this.cartItems) {
            throw CartError.CartItemNotIncluded()
        }
        let NEW_TOTAL = 0
        this.cartItems.map(item => {
            if (!item.product) {
                throw new Error('Cart item product not defined')
            }
            NEW_TOTAL += (item.product.price * item.quantity)
        })
        this.total = NEW_TOTAL
        return this
    }
}
