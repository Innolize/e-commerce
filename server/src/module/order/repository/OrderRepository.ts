import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractRepository } from "../../abstractClasses/abstractRepository";
import { Cart } from "../../cart/entities/Cart";
import { Order } from "../entities/Order";
import { OrderError } from "../error/OrderError";
import { OrderItemModel } from "../model/OrderItemModel";
import { OrderModel } from "../model/OrderModel";

@injectable()
export class OrderRepository extends AbstractRepository {
    constructor(
        @inject(TYPES.Order.OrderModel) private orderModel: typeof OrderModel,
        @inject(TYPES.Order.OrderModel) private orderItemModel: typeof OrderItemModel
    ) {
        super()
    }

    async create(cart: Cart, userId: number): Promise<Order> {
        if (!cart.cartItems?.length) {
            throw OrderError.currentCartEmpty()
        }

        const orderItems = this.fromCartItemToOrderItem(cart)

        const currentOrder = await this.orderModel.create(
            { user_id: userId, payment_id: 1, orderItems },
            { include: { association: OrderModel.associations.orderItems } })

        return currentOrder

    }

    private fromCartItemToOrderItem = (cart: Cart) => {
        const itemsArray = cart.cartItems!.map(item => {
            const { product_id, quantity, product } = item
            if (!product) {
                throw new Error('Product not populated')
            }
            const orderItem = {
                price_per_unit: item.product!.price,
                product_id: product_id,
                quantity: item.quantity,
                total: item.product!.price * quantity
            }
            return orderItem
        })
        return itemsArray
    }
}