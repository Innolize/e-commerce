import { Application } from "express";
import { injectable } from "inversify";
import { AbstractController } from "../../abstractClasses/abstractController";

@injectable()
export class CartController extends AbstractController {
    public ROUTE_BASE: string
    constructor() {
        super()
        this.ROUTE_BASE = "/cart"
    }

    configureRoutes(app: Application) {
        const ROUTE = this.ROUTE_BASE
    }
}