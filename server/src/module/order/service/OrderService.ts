import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractService } from "../../abstractClasses/abstractService";
import { IUserWithAuthorization } from "../../authorization/interfaces/IUserWithAuthorization";
import { Cart } from "../../cart/entities/Cart";
import { IGetAllResponse } from "../../common/interfaces/IGetAllResponseGeneric";
import { Order } from "../entities/Order";
import { OrderRepository } from "../repository/OrderRepository";

@injectable()
export class OrderService extends AbstractService {
    constructor(
        @inject(TYPES.Order.Repository) private orderRepository: OrderRepository
    ) {
        super()
    }

    async create(cart: Cart, user: IUserWithAuthorization): Promise<Order> {
        const response = await this.orderRepository.create(cart, user.id)
        return response
    }

    async getOrders(user: IUserWithAuthorization, limit?: number, offset?: number): Promise<IGetAllResponse<Order>> {
        const ADMIN_ID = 1
        if (user.id === ADMIN_ID) {
            return await this.orderRepository.getOrders(limit, offset)
        } else {
            return await this.orderRepository.getOrders(limit, offset, user.id)
        }
    }
}