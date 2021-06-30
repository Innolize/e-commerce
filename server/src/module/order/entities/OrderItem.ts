import { Product } from "../../product/entity/Product";
import { IOrderItem } from "../interfaces/IOrder";

export class OrderItem implements IOrderItem {
    constructor(
        public product_id: number,
        public quantity: number,
        public price_per_unit: number,
        public total: number,
        public id?: number,
        public product?: Product
    ) {}
}