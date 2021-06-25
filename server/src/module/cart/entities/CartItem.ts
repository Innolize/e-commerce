import { Product } from "../../product/entity/Product";
import { ICartItem } from "../interface/ICartItem";

export class CartItem implements ICartItem {
    static readonly modelName = 'CartItem'
    constructor(
        public product_id: number,
        public quantity: number,
        public cart_id: number,
        public id?: number,
        public product?: Product
    ) { }
}