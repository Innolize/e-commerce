import { Application, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";
import { Multer } from "multer";
import { TYPES } from "../../../config/inversify.types";
import { AbstractController } from "../../abstractClasses/abstractController";
import { jwtAuthentication } from "../../auth/util/passportMiddlewares";
import { authorizationMiddleware } from "../../authorization/util/authorizationMiddleware";
import { bodyValidator } from "../../common/helpers/bodyValidator";
import { CartError } from "../error/CartError";
import { validateCreateCartItemDto } from "../helpers/create_cart_item_dto";
import { validateGetCartDto } from "../helpers/get_cart_dto";
import { ICartGetAllQuery } from "../interface/ICartGetAllQuery";
import { ICartItemCreateFromCartModel } from "../interface/ICartItemCreateFromCart";
import { CartService } from "../service/CartService";

@injectable()
export class CartController extends AbstractController {
    public ROUTE_BASE: string
    constructor(
        @inject(TYPES.Cart.Service) private cartService: CartService,
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
        const dto: ICartGetAllQuery = req.query
        const user = req.user
        try {
            const { limit, offset, userId } = await bodyValidator(validateGetCartDto, dto)
            const response = await this.cartService.getCarts({ limit, offset, userId }, user)
            res.status(200).send(response)
        } catch (err) {
            next(err)
        }
    }

    async getSingleCart(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { cartId } = req.params
        const user = req.user
        try {
            if (!user || !user.id) {
                throw new Error('Not autenticated')
            }
            const cartIdNumber = Number(cartId)
            if (!cartIdNumber || cartIdNumber <= 0) {
                throw CartError.invalidCartId()
            }
            const response = await this.cartService.getCart(cartIdNumber, user)
            res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
        }
    }

    async addCartItem(req: Request, res: Response, next: NextFunction): Promise<void> {
        const user = req.user
        const { cartId } = req.params
        const dto: ICartItemCreateFromCartModel = req.body
        try {
            const cartIdNumber = Number(cartId)
            if (!cartIdNumber || cartIdNumber <= 0) {
                throw CartError.invalidCartId()
            }
            const validatedDto = await bodyValidator(validateCreateCartItemDto, dto)
            const response = await this.cartService.addCartItem(cartIdNumber, validatedDto, user)
            res.status(201).send(response)
        } catch (err) {
            next(err)
        }
    }

    async removeCartItem(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { cartId, itemId } = req.params
        const user = req.user
        try {
            const cartIdNumber = Number(cartId)
            if (!cartIdNumber || cartIdNumber <= 0) {
                throw CartError.invalidCartId()
            }
            const itemIdNumber = Number(itemId)
            if (!itemIdNumber || itemIdNumber <= 0) {
                throw CartError.invalidCartItemId()
            }
            await this.cartService.removeCartItem(cartIdNumber, itemIdNumber, user)
            res.status(StatusCodes.OK).send({ message: 'Cart item removed successfully!' })
        } catch (err) {
            next(err)
        }
    }

}