import { Payment } from "../entities/Payment"
import { IPayment } from "../interfaces/IPayment"

export const fromDbToPayment = (model: IPayment): Payment => {
    const { amount, type, id, order_id, status } = model
    return new Payment(id, order_id, status, type, amount)
}