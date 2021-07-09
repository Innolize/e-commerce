import { PAYMENT_STATUS, PAYMENT_TYPE } from "../../../config/constants/pcbuilder";
import { Order } from "../../order/entities/Order";

export type IPaymentStatus = typeof PAYMENT_STATUS[number]
export type IPaymentType = typeof PAYMENT_TYPE[number]

export interface IPayment {
    id: number,
    order_id: number,
    status: IPaymentStatus,
    type: IPaymentType,
    amount: number,
    order?: Order
}

