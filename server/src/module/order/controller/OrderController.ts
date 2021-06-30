import { Application, NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractController } from "../../abstractClasses/abstractController";
import { OrderRepository } from "../repository/OrderRepository";

@injectable()
export class OrderController extends AbstractController {
    private ROUTE: string
    constructor(
        @inject(TYPES.Order.Repository) private orderRepository: OrderRepository
    ) {
        super()
        this.ROUTE = '/order'
    }

    public configureRoutes(app: Application): void {
        const ROUTE = this.ROUTE
        app.post(`/api${ROUTE}`, this.create.bind(this))
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { cart, id: userId } = req.user
        if (!cart) {
            throw new Error('12345667')
        }
        try {
            await this.orderRepository.create(cart, userId)
            res.sendStatus(200)
        } catch (err) {
            next(err)
        }


    }
}