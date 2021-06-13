import { Product } from "../../product/entity/Product";

export interface ICartItem {
    product_id: number,
    quantity: number,
    cart_id: number,
    id?: number,
    product?: Product
}