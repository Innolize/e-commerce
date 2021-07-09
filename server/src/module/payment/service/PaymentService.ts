import { query } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractService } from "../../abstractClasses/abstractService";
import { IGetAllResponse } from "../../common/interfaces/IGetAllResponseGeneric";
import { Payment } from "../entities/Payment";
import { IPaymentGetAllQueries } from "../interfaces/IPaymentGetAllQueries";
import { PaymentRepository } from "../repository/PaymentRepository";

@injectable()
export class PaymentService extends AbstractService {
    constructor(
        @inject(TYPES.Payment.Repository) private paymentRepository: PaymentRepository
    ) {
        super()
    }

    async getAll(queryParams: IPaymentGetAllQueries): Promise<IGetAllResponse<Payment>> {

        const DEFAULT_OFFSET = 0
        const DEFAULT_LIMIT = 20
        const { limit, offset, status } = queryParams
        const query: IPaymentGetAllQueries = {
            status,
            offset: offset || DEFAULT_OFFSET,
            limit: limit || DEFAULT_LIMIT
        }
        return await this.paymentRepository.getAll(query)
    }

    async getSingle(id: number): Promise<Payment> {
        return await this.paymentRepository.getSingle(id)
    }

    async updateAsPaid(paymentId: number): Promise<Payment> {
        return await this.paymentRepository.modifyPayment(paymentId, "PAID")
    }
}