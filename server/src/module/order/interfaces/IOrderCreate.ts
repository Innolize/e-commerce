import { IOrder } from "./IOrder";
import { IOrderItemCreate } from "./IOrderItemCreate";

export type IOrderItemAssociated = Omit<IOrderItemCreate, 'order_id'>

export type IOrderCreate = Omit<IOrder, 'id' | 'orderItems' | 'payment'> & {
    orderItems?: IOrderItemAssociated[]
}