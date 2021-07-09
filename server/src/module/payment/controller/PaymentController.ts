import { Application, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { inject } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractController } from "../../abstractClasses/abstractController";
import { jwtAuthentication } from "../../auth/util/passportMiddlewares";
import { authorizationMiddleware } from "../../authorization/util/authorizationMiddleware";
import { BaseError } from "../../common/error/BaseError";
import { bodyValidator } from "../../common/helpers/bodyValidator";
import { validateGetAllQueriesPaymentDto } from "../helper/get_all_query_dto_validator";
import { IPaymentGetAllQueries } from "../interfaces/IPaymentGetAllQueries";
import { PaymentService } from "../service/PaymentService";

export class PaymentController extends AbstractController {
    private ROUTE
    constructor(
        @inject(TYPES.Payment.Service) private paymentService: PaymentService
    ) {
        super()
        this.ROUTE = "/payment"
    }

    configureRoutes(app: Application): void {
        const ROUTE = this.ROUTE
        app.get(`/api${ROUTE}`, [jwtAuthentication, authorizationMiddleware({ action: "read", subject: "Payment" })], this.getAll.bind(this));
        app.get(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: "read", subject: "Payment" })], this.getSingle.bind(this));
        app.put(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: "update", subject: "Payment" })], this.updateAsPaid.bind(this));
    }

    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        const queriesDto: IPaymentGetAllQueries = req.query
        try {
            const validDto = await bodyValidator(validateGetAllQueriesPaymentDto, queriesDto)
            const response = await this.paymentService.getAll(validDto)
            res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
        }
    }

    async getSingle(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params
        try {
            const idNumber = Number(id)
            if (!idNumber) {
                throw BaseError.idParamNotDefined()
            }
            const response = await this.paymentService.getSingle(idNumber)
            res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
        }
    }

    async updateAsPaid(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params
        try {
            const idNumber = Number(id)
            if (!idNumber) {
                throw BaseError.idParamNotDefined()
            }
            await this.paymentService.updateAsPaid(idNumber)
            res.status(StatusCodes.OK).send({ message: `Payment with id ${idNumber} updated` })
        } catch (err) {
            next(err)
        }
    }
}