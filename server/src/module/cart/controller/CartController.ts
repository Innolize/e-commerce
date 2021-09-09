import { Application, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";
import { Multer } from "multer";
import { TYPES } from "../../../config/inversify.types";
import { AbstractController } from "../../abstractClasses/abstractController";
import { jwtAuthentication } from "../../auth/util/passportMiddlewares";
import { authorizationMiddleware } from "../../authorization/util/authorizationMiddleware";
import { BaseError } from "../../common/error/BaseError";
import { bodyValidator } from "../../common/helpers/bodyValidator";
import { validateCreateCartItemDto } from "../helpers/create_cart_item_dto";
import { validateGetCartDto } from "../helpers/get_cart_dto";
import { ICartGetAllQuery } from "../interface/ICartGetAllQuery";
import { ICartItemCreateFromCartModel } from "../interface/ICartItemCreateFromCart";
import { ICartService } from "../interface/ICartService";

@injectable()
export class CartController extends AbstractController {
    private ROUTE_BASE: string
    constructor(
        @inject(TYPES.Cart.Service) private cartService: ICartService,
        @inject(TYPES.Common.UploadMiddleware) private uploadMiddleware: Multer
    ) {
        super()
        this.ROUTE_BASE = "/cart"
    }

    configureRoutes(app: Application): void {
        const ROUTE = this.ROUTE_BASE
        app.get(`/api${ROUTE}`, [jwtAuthentication, authorizationMiddleware({ action: 'manage', subject: 'all' })], this.getAllCarts.bind(this))
        app.get(`/api${ROUTE}/:cartId`, [jwtAuthentication, authorizationMiddleware({ action: 'read', subject: 'Cart' })], this.getSingleCart.bind(this))
        app.post(`/api${ROUTE}/:cartId/item`, [jwtAuthentication, authorizationMiddleware({ action: 'update', subject: 'Cart' })], this.uploadMiddleware.none(), this.addCartItem.bind(this))
        app.delete(`/api${ROUTE}/:cartId/item/:itemId`, [jwtAuthentication, authorizationMiddleware({ action: 'update', subject: 'Cart' })], this.removeCartItem.bind(this))
    }

    async getAllCarts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dto: ICartGetAllQuery = req.query
            const user = req.user
            const { limit, offset } = await bodyValidator(validateGetCartDto, dto)
            const response = await this.cartService.getCarts({ limit, offset }, user)
            res.status(200).send(response)
        } catch (err) {
            next(err)
        }
    }

    async getSingleCart(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { cartId } = req.params
            const user = req.user
            if (!user || !user.id) {
                throw new Error('Not autenticated')
            }
            const cartIdNumber = BaseError.validateNumber(cartId)
            const response = await this.cartService.getCart(cartIdNumber, user)
            res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
        }
    }

    async addCartItem(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = req.user
            const { cartId } = req.params
            const dto: ICartItemCreateFromCartModel = req.body

            const cartIdNumber = BaseError.validateNumber(cartId)

            const validatedDto = await bodyValidator(validateCreateCartItemDto, dto)
            const response = await this.cartService.addCartItem(cartIdNumber, validatedDto, user)
            res.status(201).send(response)
        } catch (err) {
            next(err)
        }
    }

    async removeCartItem(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { cartId, itemId } = req.params
            const user = req.user
            const cartIdNumber = BaseError.validateNumber(cartId)
            const itemIdNumber = BaseError.validateNumber(itemId)
            await this.cartService.removeCartItem(cartIdNumber, itemIdNumber, user)
            res.status(StatusCodes.OK).send({ message: 'Cart item removed successfully!' })
        } catch (err) {
            next(err)
        }
    }

}