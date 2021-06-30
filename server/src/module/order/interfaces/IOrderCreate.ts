import { IOrder } from "./IOrder";

export type IOrderCreate = Omit<IOrder, 'id' | 'cartItems' | 'payment' >