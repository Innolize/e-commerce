import { IOrderItem } from "./IOrderItem";

export type IOrderItemCreate = Omit<IOrderItem, 'id' | 'product'>