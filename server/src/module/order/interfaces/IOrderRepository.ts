import { Cart } from "../../cart/entities/Cart";
import { IGetAllResponse } from "../../common/interfaces/IGetAllResponseGeneric";
import { IPaymentType } from "../../payment/interfaces/IPayment";
import { Order } from "../entities/Order";

export interface IOrderRepository {
    create: (cart: Cart, userId: number, paymentType: IPaymentType) => Promise<Order>,
    getAll: (limit?: number, offset?: number, userId?: number) => Promise<IGetAllResponse<Order>>,
    getSingle: (id: number) => Promise<Order>,
    delete: (id: number) => Promise<true>
}