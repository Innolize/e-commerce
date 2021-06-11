import { Application, NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { Multer } from "multer";
import { TYPES } from "../../../config/inversify.types";
import { AbstractController } from "../../abstractClasses/abstractController";
import { bodyValidator } from "../../common/helpers/bodyValidator";
import { CartError } from "../error/CartError";
import { validateCreateCartItemDto, validateCreateCartItemSchema } from "../helpers/create_cart_item_dto";
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
        app.get(`/api${ROUTE}`, this.getAllCarts.bind(this))
        app.get(`/api${ROUTE}/:id`, this.getSingleCart.bind(this))
        app.post(`/api${ROUTE}/:cartId/item`, this.uploadMiddleware.none(), this.addCartItem.bind(this))
        app.delete(`/api${ROUTE}/:cartId/item/:itemId`, this.removeCartItem.bind(this))
        app.put(`/api${ROUTE}/:cartId/item/:itemId`, this.modifyCartItemQuantity.bind(this))
    }

    async getAllCarts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response = await this.cartService.getCarts()
            res.status(200).send(response)
        } catch (err) {
            next(err)
        }
    }

    async getSingleCart(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.sendStatus(501)
        } catch (err) {
            next(err)
        }
    }

    async addCartItem(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { cartId } = req.params
        const dto: ICartItemCreateFromCartModel = req.body
        try {
            const cartIdNumber = Number(cartId)
            if (!cartIdNumber || cartIdNumber <= 0) {
                throw CartError.invalidId()
            }
            const validatedDto = await bodyValidator(validateCreateCartItemDto, dto)
            const response = await this.cartService.addCartItem(cartIdNumber, validatedDto)
            res.status(201).send(response)
        } catch (err) {
            next(err)
        }
    }

    async removeCartItem(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { cartId, itemId } = req.params
        try {
            const cartIdNumber = Number(cartId)
            if (!cartIdNumber || cartIdNumber <= 0) {
                throw CartError.invalidId()
            }
            const itemIdNumber = Number(itemId)
            if (!itemIdNumber || itemIdNumber <= 0) {
                throw CartError.invalidId()
            }
            res.sendStatus(501)
        } catch (err) {
            next(err)
        }
    }

    async modifyCartItemQuantity(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.sendStatus(501)
        } catch (err) {
            next(err)
        }
    }
}