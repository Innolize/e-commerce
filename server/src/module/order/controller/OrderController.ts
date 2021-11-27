import { Application, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";
import { Multer } from "multer";
import { TYPES } from "../../../config/inversify.types";
import { AbstractController } from "../../abstractClasses/abstractController";
import { jwtAuthentication } from "../../auth/util/passportMiddlewares";
import { authorizationMiddleware } from "../../authorization/util/authorizationMiddleware";
import { CartError } from "../../cart/error/CartError";
import { ICartService } from "../../cart/interface/ICartService";
import { BaseError } from "../../common/error/BaseError";
import { bodyValidator } from "../../common/helpers/bodyValidator";
import { validateCreateOrderDto } from "../helpers/create_dto_validator";
import { validateGetOrderDto } from "../helpers/get_dto_validator";
import { IOrderCreateDto } from "../interfaces/IOrderCreate";
import { IOrderGetAllQUeries } from "../interfaces/IOrderGetallQueries";
import { IOrderService } from "../interfaces/IOrderService";

@injectable()
export class OrderController extends AbstractController {
    private ROUTE: string
    constructor(
        @inject(TYPES.Order.Service) private orderService: IOrderService,
        @inject(TYPES.Cart.Service) private cartService: ICartService,
        @inject(TYPES.Common.UploadMiddleware) private uploadMiddleware: Multer
    ) {
        super()
        this.ROUTE = '/order'
    }

    public configureRoutes(app: Application): void {
        const ROUTE = this.ROUTE
        app.post(`/api${ROUTE}`, this.uploadMiddleware.none(), jwtAuthentication, authorizationMiddleware({ action: 'create', subject: 'Order' }), this.create.bind(this))
        app.get(`/api${ROUTE}`, jwtAuthentication, authorizationMiddleware({ action: 'read', subject: 'Order' }), this.getOrders.bind(this))
        app.get(`/api${ROUTE}/:id`, jwtAuthentication, authorizationMiddleware({ action: 'read', subject: 'Order' }), this.getSingle.bind(this))
        app.delete(`/api${ROUTE}/:id`, jwtAuthentication, authorizationMiddleware({ action: 'delete', subject: 'Order' }), this.delete.bind(this))
    }

    async getOrders(req: Request, res: Response, next: NextFunction): Promise<void> {

        try {
            const user = req.user
            const queries: IOrderGetAllQUeries = req.query
            const { limit, offset } = await bodyValidator(validateGetOrderDto, queries)
            const response = await this.orderService.getAll(user, limit, offset)
            res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
        }
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = req.user
            const dto: IOrderCreateDto = req.body
            if (!user.cart) {
                throw CartError.cartNotFound()
            }
            const { paymentType } = await bodyValidator(validateCreateOrderDto, dto)
            const cartId = user.cart.id as number
            const cart = await this.cartService.getCart(cartId, user)
            const orderCreated = await this.orderService.create(cart, user, paymentType)
            await this.cartService.clearCartItems(cartId, user)
            res.status(StatusCodes.OK).send(orderCreated)
        } catch (err) {
            next(err)
        }
    }

    async getSingle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params
            const validId = BaseError.validateNumber(id)
            const response = await this.orderService.getSingle(validId)
            res.status(200).send(response)
        } catch (err) {
            next(err)
        }
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params
            const user = req.user
            const validId = BaseError.validateNumber(id)
            const response = await this.orderService.delete(validId, user)
            res.status(200).send(response)
        } catch (err) {
            next(err)
        }
    }
}