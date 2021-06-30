import { IOrder } from "./IOrder";
import { IOrderItemCreate } from "./IOrderItemCreate";

export type IOrderItemAssociated = Omit<IOrderItemCreate, 'order_id'>

export type IOrderCreate = Omit<IOrder, 'id' | 'cartItems' | 'payment'> & {
    orderItems?: IOrderItemAssociated[]
}