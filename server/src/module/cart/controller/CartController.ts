import { Application, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { injectable } from "inversify";
import { AbstractController } from "../../abstractClasses/abstractController";

@injectable()
export class CartController extends AbstractController {
    public ROUTE_BASE: string
    constructor() {
        super()
        this.ROUTE_BASE = "/cart"
    }

    configureRoutes(app: Application): void {
        const ROUTE = this.ROUTE_BASE
        app.get(`/api${ROUTE}`, this.getAllCarts.bind(this))
        app.get(`/api${ROUTE}/:id`, this.getSingleCart.bind(this))
        app.post(`/api${ROUTE}/:cartId/item`, this.addCartItem.bind(this))
        app.delete(`/api${ROUTE}/:cartId/item/:itemId`, this.removeCartItem.bind(this))
        app.put(`/api${ROUTE}/:cartId/item/:itemId`, this.modifyCartItemQuantity.bind(this))
    }

    async getAllCarts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.status(StatusCodes.NOT_IMPLEMENTED).send(StatusCodes.NOT_IMPLEMENTED)
        } catch (err) {
            next(err)
        }
    }

    async getSingleCart(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.status(StatusCodes.NOT_IMPLEMENTED).send(StatusCodes.NOT_IMPLEMENTED)
        } catch (err) {
            next(err)
        }
    }

    async addCartItem(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.status(StatusCodes.NOT_IMPLEMENTED).send(StatusCodes.NOT_IMPLEMENTED)
        } catch (err) {
            next(err)
        }
    }

    async removeCartItem(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.status(StatusCodes.NOT_IMPLEMENTED).send(StatusCodes.NOT_IMPLEMENTED)
        } catch (err) {
            next(err)
        }
    }

    async modifyCartItemQuantity(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.status(StatusCodes.NOT_IMPLEMENTED).send(StatusCodes.NOT_IMPLEMENTED)
        } catch (err) {
            next(err)
        }
    }
}