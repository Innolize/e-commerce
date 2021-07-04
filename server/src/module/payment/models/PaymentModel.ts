import { Model } from "sequelize";
import { PAYMENT_STATUS, PAYMENT_TYPE } from "../../../config/constants/pcbuilder";
import { Payment } from "../entities/Payment";
import { IPayment } from "../interfaces/IPayment";
import { IPaymentCreate } from "../interfaces/IPaymentCreate";

export class PaymentModel extends Model<Payment, IPaymentCreate> implements IPayment {
    id: number;
    order_id: number;
    status: typeof PAYMENT_STATUS[number];
    type: typeof PAYMENT_TYPE[number];
    amount: number;

}