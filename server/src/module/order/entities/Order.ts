import { IOrder, IOrderItem, IPayment } from "../interfaces/IOrder";

export class Order implements IOrder {
    constructor(
        public user_id: number,
        public payment_id: number,
        public id?: number,
        public cartItems?: IOrderItem[],
        public payment?: IPayment
    ) { }
}