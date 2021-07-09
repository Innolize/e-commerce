export { PaymentController } from "./controller/PaymentController"
export { PaymentService } from "./service/PaymentService"
export { PaymentRepository } from "./repository/PaymentRepository"
export { PaymentModel } from "./models/PaymentModel"

import { Application } from "express";
import { Container } from "inversify";
import { TYPES } from "../../config/inversify.types";
import { PaymentController } from "./controller/PaymentController";

export function init(app: Application, container: Container): void {
    const controller = container.get<PaymentController>(TYPES.Payment.Controller)
    controller.configureRoutes(app)
}