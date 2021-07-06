import { inject, injectable } from "inversify";
import { WhereOptions } from "sequelize/types";
import { TYPES } from "../../../config/inversify.types";
import { AbstractRepository } from "../../abstractClasses/abstractRepository";
import { Cart } from "../../cart/entities/Cart";
import { IGetAllResponse } from "../../common/interfaces/IGetAllResponseGeneric";
import { Order } from "../entities/Order";
import { OrderError } from "../error/OrderError";
import { IOrderItemAssociated, IOrderPaymentAssociated } from "../interfaces/IOrderCreate";
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
        const payment = this.createOrderPaymentAssociation(orderItems)

        const newOrder = await this.orderModel.create(
            { user_id: userId, orderItems, payment },
            { include: [{ association: OrderModel.associations.orderItems }, { association: OrderModel.associations.payment }] })
        const order = fromDbToOrder(newOrder)
        return order
    }

    async getOrders(limit?: number, offset?: number, userId?: number): Promise<IGetAllResponse<Order>> {
        const whereOptions: WhereOptions<Order> = {}
        userId ? whereOptions.user_id = userId : ''
        const { count, rows } = await this.orderModel.findAndCountAll(
            { where: whereOptions, limit, offset, include: [{ association: OrderModel.associations.orderItems, include: [{ association: OrderItemModel.associations.product }] }, { association: OrderModel.associations.payment }] }
        )
        const orders = rows.map(fromDbToOrder)
        const response: IGetAllResponse<Order> = { count, results: orders }
        return response
    }



    async getSingleOrder(id: number): Promise<Order> {
        const response = await this.orderModel.findByPk(id, { include: [{ association: OrderModel.associations.orderItems }, { association: OrderModel.associations.payment }] })
        if (!response) {
            throw OrderError.notFound()
        }

        const order = fromDbToOrder(response)
        return order
    }

    async deleteOrder(id: number): Promise<true> {
        const response = await this.orderModel.destroy({ where: { id } })
        if (!response) {
            throw OrderError.notFound()
        }
        return true
    }

    private createOrderPaymentAssociation(orderItems: IOrderItemAssociated[]): IOrderPaymentAssociated {
        const total = orderItems.reduce((total, currentItem) => {
            const { price_per_unit, quantity } = currentItem
            const orderItemTotal = price_per_unit * quantity
            return total + orderItemTotal
        }, 0)

        const payment: IOrderPaymentAssociated = {
            amount: total,
            type: 'CASH'
        }
        return payment
    }
}