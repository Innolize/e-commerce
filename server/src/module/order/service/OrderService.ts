import { ForbiddenError } from "@casl/ability";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractService } from "../../abstractClasses/abstractService";
import { IUserWithAuthorization } from "../../authorization/interfaces/IUserWithAuthorization";
import { appAbility } from "../../authorization/util/abilityBuilder";
import { Cart } from "../../cart/entities/Cart";
import { IGetAllResponse } from "../../common/interfaces/IGetAllResponseGeneric";
import { IPaymentType } from "../../payment/interfaces/IPayment";
import { Order } from "../entities/Order";
import { OrderError } from "../error/OrderError";
import { IOrderRepository } from "../interfaces/IOrderRepository";
import { IOrderService } from "../interfaces/IOrderService";

@injectable()
export class OrderService extends AbstractService implements IOrderService {
    constructor(
        @inject(TYPES.Order.Repository) private orderRepository: IOrderRepository
    ) {
        super()
    }

    async getAll(user: IUserWithAuthorization, limit?: number, offset?: number): Promise<IGetAllResponse<Order>> {
        const ADMIN_ID = 1
        if (user.id === ADMIN_ID) {
            return await this.orderRepository.getAll(limit, offset)
        } else {
            return await this.orderRepository.getAll(limit, offset, user.id)
        }
    }
    
    async create(cart: Cart, user: IUserWithAuthorization, paymentType: IPaymentType): Promise<Order> {
        const response = await this.orderRepository.create(cart, user.id, paymentType)
        return response
    }  

    async getSingle(id: number): Promise<Order> {
        return await this.orderRepository.getSingle(id)
    }

    async delete(orderId: number, user: IUserWithAuthorization): Promise<true> {
        const order = await this.orderRepository.getSingle(orderId)
        ForbiddenError.from<appAbility>(user.role.permissions).throwUnlessCan('delete', order)
        if (order.payment?.status === 'PAID') {
            throw OrderError.deletePaidOrder()
        }
        await this.orderRepository.delete(orderId)
        return true
    }
}