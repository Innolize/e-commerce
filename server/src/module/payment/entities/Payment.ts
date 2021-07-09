import { Order } from "../../order/entities/Order";
import { IPayment, IPaymentStatus, IPaymentType } from "../interfaces/IPayment";

export class Payment implements IPayment {
    static readonly modelName = 'Payment'
    constructor(
        public id: number,
        public order_id: number,
        public status: IPaymentStatus,
        public type: IPaymentType,
        public amount: number,
        public order?: Order
    ) { }
}