import { PAYMENT_STATUS, PAYMENT_TYPE } from "../../../config/constants/pcbuilder";
import { IPayment } from "../interfaces/IPayment";

export class Payment implements IPayment {
    static readonly modelName = 'Payment'
    constructor(
        public id: number,
        public order_id: number,
        public status: typeof PAYMENT_STATUS[number],
        public type: typeof PAYMENT_TYPE[number],
        public amount: number
    ) { }
}