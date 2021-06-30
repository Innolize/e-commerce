import { Application, NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractController } from "../../abstractClasses/abstractController";
import { jwtAuthentication } from "../../auth/util/passportMiddlewares";
import { CartService } from "../../cart/service/CartService";
import { OrderService } from "../service/OrderService";

@injectable()
export class OrderController extends AbstractController {
    private ROUTE: string
    constructor(
        @inject(TYPES.Order.Service) private orderService: OrderService,
        @inject(TYPES.Cart.Service) private cartService: CartService
    ) {
        super()
        this.ROUTE = '/order'
    }

    public configureRoutes(app: Application): void {
        const ROUTE = this.ROUTE
        app.post(`/api${ROUTE}`, jwtAuthentication, this.create.bind(this))
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        const user = req.user

        try {
            if (!user.cart) {
                throw new Error('12345667')
            }
            const cartId = user.cart.id as number
            const cart = await this.cartService.getCart(cartId, user)
            const orderCreated = await this.orderService.create(cart, user)
            res.status(200).send({ orderCreated })
        } catch (err) {
            next(err)
        }


    }
}