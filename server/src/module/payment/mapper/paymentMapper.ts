import { fromDbToOrder } from "../../order/mapper/orderMapper"
import { Payment } from "../entities/Payment"
import { IPayment } from "../interfaces/IPayment"

export const fromDbToPayment = (model: IPayment): Payment => {
    const { amount, type, id, order_id, status, order } = model
    const order_payment = order ? fromDbToOrder(order) : undefined
    return new Payment(id, order_id, status, type, amount, order_payment)
}