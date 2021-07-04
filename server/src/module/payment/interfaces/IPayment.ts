import { PAYMENT_STATUS, PAYMENT_TYPE } from "../../../config/constants/pcbuilder";

export interface IPayment {
    id: number,
    order_id: number,
    status: typeof PAYMENT_STATUS[number],
    type: typeof PAYMENT_TYPE[number],
    amount: number
}

