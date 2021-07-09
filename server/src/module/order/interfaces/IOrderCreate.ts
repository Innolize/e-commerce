import { IPaymentType } from "../../payment/interfaces/IPayment";
import { IPaymentCreate } from "../../payment/interfaces/IPaymentCreate";
import { IOrder } from "./IOrder";
import { IOrderItemCreate } from "./IOrderItemCreate";

export type IOrderItemAssociated = Omit<IOrderItemCreate, 'order_id'>
export type IOrderPaymentAssociated = Omit<IPaymentCreate, 'order_id'>

export type IOrderCreate = Omit<IOrder, 'id' | 'orderItems' | 'payment'> & {
    orderItems?: IOrderItemAssociated[],
    payment?: IOrderPaymentAssociated
}

export type IOrderCreateDto = {
    paymentType: IPaymentType
}