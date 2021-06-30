export { OrderController } from './controller/OrderController'
export { OrderRepository } from './repository/OrderRepository'
export { OrderModel } from './model/OrderModel'
export { OrderItemModel } from './model/OrderItemModel'

import { Application } from 'express'
import { Container } from 'inversify'
import { TYPES } from '../../config/inversify.types'
import { OrderController } from './controller/OrderController'
import { OrderRepository } from './repository/OrderRepository'

export function init(app: Application, container: Container): void {
    const controller = container.get<OrderController>(TYPES.Order.Controller)
    controller.configureRoutes(app)
}