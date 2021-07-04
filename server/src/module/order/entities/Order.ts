import { IOrder, IPayment } from "../interfaces/IOrder";
import { IOrderItem } from "../interfaces/IOrderItem";

export class Order implements IOrder {
    static readonly modelName = 'Order'
    constructor(
        public user_id: number,
        public payment_id: number,
        public id?: number,
        public orderItems?: IOrderItem[],
        public payment?: IPayment
    ) { }
}