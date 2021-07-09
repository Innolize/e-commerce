import { Payment } from "../../payment/entities/Payment";
import { User } from "../../user/entities/User";
import { IOrder } from "../interfaces/IOrder";
import { IOrderItem } from "../interfaces/IOrderItem";

export class Order implements IOrder {
    static readonly modelName = 'Order'
    constructor(
        public user_id: number,
        public id?: number,
        public orderItems?: IOrderItem[],
        public payment?: Payment,
        public user?: User
    ) { }
}