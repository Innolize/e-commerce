import { IUserWithAuthorization } from "../../authorization/interfaces/IUserWithAuthorization";
import { Cart } from "../../cart/entities/Cart";
import { IGetAllResponse } from "../../common/interfaces/IGetAllResponseGeneric";
import { IPaymentType } from "../../payment/interfaces/IPayment";
import { Order } from "../entities/Order";

export interface IOrderService {
    create: (cart: Cart, user: IUserWithAuthorization, paymentType: IPaymentType) => Promise<Order>,
    getAll: (user: IUserWithAuthorization, limit?: number, offset?: number) => Promise<IGetAllResponse<Order>>,
    getSingle: (id: number) => Promise<Order>,
    delete: (orderId: number, user: IUserWithAuthorization) => Promise<true>
}