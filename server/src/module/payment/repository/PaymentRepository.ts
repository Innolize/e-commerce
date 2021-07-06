import { inject, injectable } from "inversify";
import { WhereOptions } from "sequelize/types";
import { TYPES } from "../../../config/inversify.types";
import { AbstractRepository } from "../../abstractClasses/abstractRepository";
import { IGetAllResponse } from "../../common/interfaces/IGetAllResponseGeneric";
import { Payment } from "../entities/Payment";
import { fromDbToPayment } from "../mapper/paymentMapper";
import { PaymentModel } from "../models/PaymentModel";

@injectable()
export class PaymentRepository extends AbstractRepository {
    constructor(
        @inject(TYPES.Payment.Model) private paymentModel: typeof PaymentModel
    ) {
        super()
    }

    async getAll(paid?: boolean, limit?: number, offset?: number): Promise<IGetAllResponse<Payment>> {
        const where: WhereOptions<Payment> = {}
        paid ? where.status = "PAID" : where.status = "PENDING"
        const { count, rows } = await this.paymentModel.findAndCountAll({ where, limit, offset, include: PaymentModel.associations.order })
        const results = rows.map(fromDbToPayment)
        return { count, results }
    }

    async getSingle(id: number): Promise<Payment> {
        const dbResponse = await this.paymentModel.findByPk(id, { include: PaymentModel.associations.order })
        if (!dbResponse) {
            throw new Error('Payment not found')
        }
        return fromDbToPayment(dbResponse)
    }
}