import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractService } from "../../abstractClasses/abstractService";
import { IGetAllResponse } from "../../common/interfaces/IGetAllResponseGeneric";
import { Payment } from "../entities/Payment";
import { PaymentRepository } from "../repository/PaymentRepository";

@injectable()
export class PaymentService extends AbstractService {
    constructor(
        @inject(TYPES.Payment.Repository) private paymentRepository: PaymentRepository
    ) {
        super()
    }

    async getAll(): Promise<IGetAllResponse<Payment>> {
        return await this.paymentRepository.getAll()
    }

    async getSingle(id: number): Promise<Payment> {
        return await this.paymentRepository.getSingle(id)
    }

    async updateAsPaid(paymentId: number): Promise<Payment> {
        return await this.paymentRepository.modifyPayment(paymentId, "PAID")
    }
}