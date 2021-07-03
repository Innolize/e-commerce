import { inject, injectable } from "inversify";
import { WhereOptions } from "sequelize/types";
import { TYPES } from "../../../config/inversify.types";
import { AbstractRepository } from "../../abstractClasses/abstractRepository";
import { Cart } from "../../cart/entities/Cart";
import { Order } from "../entities/Order";
import { fromDbToOrder, mapOrderItemsFromCart } from "../mapper/orderMapper";
import { OrderModel } from "../model/OrderModel";

@injectable()
export class OrderRepository extends AbstractRepository {
    constructor(
        @inject(TYPES.Order.OrderModel) private orderModel: typeof OrderModel,
    ) {
        super()
    }

    async create(cart: Cart, userId: number): Promise<Order> {
        const orderItems = mapOrderItemsFromCart(cart)

        const currentOrder = await this.orderModel.create(
            { user_id: userId, payment_id: 1, orderItems },
            { include: { association: OrderModel.associations.orderItems } })

        return currentOrder
    }

    async getOrders(): Promise<Order[]> {
        const whereOptions: WhereOptions<Order> = {}
        const response = await this.orderModel.findAndCountAll({ where: whereOptions, include: { association: OrderModel.associations.orderItems } })
        const { rows } = response
        const orders = rows.map(fromDbToOrder)
        return orders
    }
}