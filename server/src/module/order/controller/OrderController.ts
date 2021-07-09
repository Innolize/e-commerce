import { Application, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";
import { Multer } from "multer";
import { TYPES } from "../../../config/inversify.types";
import { AbstractController } from "../../abstractClasses/abstractController";
import { jwtAuthentication } from "../../auth/util/passportMiddlewares";
import { authorizationMiddleware } from "../../authorization/util/authorizationMiddleware";
import { CartService } from "../../cart/service/CartService";
import { BaseError } from "../../common/error/BaseError";
import { bodyValidator } from "../../common/helpers/bodyValidator";
import { validateCreateOrderDto } from "../helpers/create_dto_validator";
import { validateGetOrderDto } from "../helpers/get_dto_validator";
import { IOrderCreateDto } from "../interfaces/IOrderCreate";
import { IOrderGetAllQUeries } from "../interfaces/IOrderGetallQueries";
import { OrderService } from "../service/OrderService";

@injectable()
export class OrderController extends AbstractController {
    private ROUTE: string
    constructor(
        @inject(TYPES.Order.Service) private orderService: OrderService,
        @inject(TYPES.Cart.Service) private cartService: CartService,
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
        const user = req.user
        const queries: IOrderGetAllQUeries = req.query
        try {
            const { limit, offset } = await bodyValidator(validateGetOrderDto, queries)
            const response = await this.orderService.getOrders(user, limit, offset)
            res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
        }
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        const user = req.user
        const dto: IOrderCreateDto = req.body
        try {
            if (!user.cart) {
                throw new Error('12345667')
            }
            const { paymentType } = await bodyValidator(validateCreateOrderDto, dto)
            const cartId = user.cart.id as number
            const cart = await this.cartService.getCart(cartId, user)
            const orderCreated = await this.orderService.create(cart, user, paymentType)
            await this.cartService.clearCartItems(cartId, user)
            res.status(200).send(orderCreated)
        } catch (err) {
            next(err)
        }
    }

    async getSingle(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params
        const idParam = Number(id)
        if (!id || !idParam) {
            throw BaseError.idParamNotDefined()
        }
        try {
            const response = await this.orderService.getSingleOrder(idParam)
            res.status(200).send(response)
        } catch (err) {
            next(err)
        }
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params
        const user = req.user
        try {
            const idParam = Number(id)
            if (!id || !idParam) {
                throw BaseError.idParamNotDefined()
            }
            const response = await this.orderService.removeOrder(idParam, user)
            res.status(200).send(response)
        } catch (err) {
            next(err)
        }
    }
}