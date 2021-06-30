import { Product } from "../../product/entity/Product";

export interface IOrderItem {
    order_id: number,
    product_id: number,
    quantity: number,
    price_per_unit: number,
    total: number,
    product?: Product,
    id?: number,
}