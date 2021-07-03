import { inject, injectable } from "inversify";
import { WhereOptions } from "sequelize/types";
import { TYPES } from "../../../config/inversify.types";
import { AbstractRepository } from "../../abstractClasses/abstractRepository";
import { Cart } from "../../cart/entities/Cart";
import { IGetAllResponse } from "../../common/interfaces/IGetAllResponseGeneric";
import { Order } from "../entities/Order";
import { fromDbToOrder, mapOrderItemsFromCart } from "../mapper/orderMapper";
import { OrderItemModel } from "../model/OrderItemModel";
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

    async getOrders(limit?: number, offset?: number, userId?: number): Promise<IGetAllResponse<Order>> {
        const whereOptions: WhereOptions<Order> = {}
        userId ? whereOptions.user_id = userId : ''
        const { count, rows } = await this.orderModel.findAndCountAll(
            { where: whereOptions, limit, offset, include: { association: OrderModel.associations.orderItems, include: [{ association: OrderItemModel.associations.product }] } }
        )
        const orders = rows.map(fromDbToOrder)
        const response: IGetAllResponse<Order> = { count, results: orders }
        return response
    }
}