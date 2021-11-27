import { Product } from "../../product/entity/Product";

export interface ICartItem {
    id: number,
    product_id: number,
    quantity: number,
    cart_id: number,
    product?: Product
}