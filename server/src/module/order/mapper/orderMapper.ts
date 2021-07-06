import { Cart } from "../../cart/entities/Cart"
import { fromDbToPayment } from "../../payment/mapper/paymentMapper"
import { fromDbToProduct } from "../../product/mapper/productMapper"
import { fromDbToUser } from "../../user/mapper/userMapper"
import { Order } from "../entities/Order"
import { OrderItem } from "../entities/OrderItem"
import { OrderError } from "../error/OrderError"
import { IOrder } from "../interfaces/IOrder"
import { IOrderItemAssociated } from "../interfaces/IOrderCreate"
import { IOrderItem } from "../interfaces/IOrderItem"

export const fromDbToOrder = (model: IOrder): Order => {
    const { orderItems, user_id, id, payment, user } = model
    const orderItems_order = orderItems ? orderItems.map(fromDbToOrderItem) : undefined
    const payment_order = payment ? fromDbToPayment(payment) : undefined
    const user_order = user ? fromDbToUser(user) : undefined
    return new Order(user_id, id, orderItems_order, payment_order, user_order)
}

export const fromDbToOrderItem = (model: IOrderItem): OrderItem => {
    const { order_id, id, price_per_unit, product_id, quantity, total, product } = model
    const order_product = product ? fromDbToProduct(product) : undefined
    return new OrderItem(product_id, order_id, quantity, price_per_unit, total, id, order_product)
}

export const mapOrderItemsFromCart = (cart: Cart): IOrderItemAssociated[] => {

    if (!cart.cartItems?.length) {
        throw OrderError.currentCartEmpty()
    }

    const itemsArray = cart.cartItems.map(item => {

        if (!item.product) {
            throw OrderError.productNotPopulated()
        }
        const { product_id, quantity, product } = item

        const orderItem: IOrderItemAssociated = {
            price_per_unit: product.price,
            product_id: product_id,
            quantity: item.quantity,
            total: product.price * quantity
        }
        return orderItem
    })
    return itemsArray
}