import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractService } from "../../abstractClasses/abstractService";
import { IUserWithAuthorization } from "../../authorization/interfaces/IUserWithAuthorization";
import { Cart } from "../../cart/entities/Cart";
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
}