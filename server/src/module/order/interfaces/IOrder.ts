import { IPayment } from "../../payment/interfaces/IPayment";
import { User } from "../../user/entities/User";
import { IOrderItem } from "./IOrderItem";

export interface IOrder {
    user_id: number,
    id?: number,
    orderItems?: IOrderItem[],
    payment?: IPayment,
    user?: User
}