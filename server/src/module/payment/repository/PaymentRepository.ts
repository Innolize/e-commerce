import { inject, injectable } from "inversify";
import { WhereOptions } from "sequelize/types";
import { TYPES } from "../../../config/inversify.types";
import { AbstractRepository } from "../../abstractClasses/abstractRepository";
import { IGetAllResponse } from "../../common/interfaces/IGetAllResponseGeneric";
import { OrderModel } from "../../order/module";
import { Payment } from "../entities/Payment";
import { IPaymentStatus } from "../interfaces/IPayment";
import { fromDbToPayment } from "../mapper/paymentMapper";
import { PaymentModel } from "../models/PaymentModel";

@injectable()
export class PaymentRepository extends AbstractRepository {
    constructor(
        @inject(TYPES.Payment.Model) private paymentModel: typeof PaymentModel
    ) {
        super()
    }

    async getAll(paymentStatus?: IPaymentStatus, limit?: number, offset?: number): Promise<IGetAllResponse<Payment>> {
        const where: WhereOptions<Payment> = {}
        paymentStatus ? where.status = paymentStatus : ""
        const { count, rows } = await this.paymentModel.findAndCountAll({
            where,
            limit,
            offset,
            include: [
                { association: PaymentModel.associations.order }
            ]
        })
        const results = rows.map(fromDbToPayment)
        return { count, results }
    }

    async getSingle(id: number): Promise<Payment> {
        const dbResponse = await this.paymentModel.findByPk(id, {
            include: {
                association: PaymentModel.associations.order,
                include: [
                    { association: OrderModel.associations.orderItems },
                    { association: OrderModel.associations.user }
                ]
            }
        })
        if (!dbResponse) {
            throw new Error('Payment not found')
        }
        return fromDbToPayment(dbResponse)
    }

    async modifyPayment(paymentId: number, newStatus: IPaymentStatus): Promise<Payment> {
        const paymentPartial: Partial<Payment> = {}
        paymentPartial.status = newStatus
        const [rows, paymentArray] = await this.paymentModel.update(paymentPartial, { where: { id: paymentId } })
        if (!rows) {
            throw new Error("Payment not found")
        }
        const updatedPayment = paymentArray[0]
        return fromDbToPayment(updatedPayment)
    }
}