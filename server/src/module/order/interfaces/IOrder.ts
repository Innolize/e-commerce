import { IOrderItem } from "./IOrderItem";

export interface IOrder {
    user_id: number,
    payment_id: number
    id?: number,
    orderItems?: IOrderItem[],
    payment?: IPayment
}

export interface IPayment{
    order_id: number,
    amount: number,
    status: "PENDING" | "PAID"
}