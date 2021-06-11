import { Product } from "../../product/entity/Product";

export class CartItem {
    constructor(
        public product_id: number,
        public quantity: number,
        public cart_id: number,
        public id?: number,
        public product?: Product
    ) { }
}