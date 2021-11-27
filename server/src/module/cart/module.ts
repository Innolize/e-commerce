export * from './controller/CartController'
export * from './model/CartItemModel'
export * from './model/CartModel'

import { Application } from 'express'
import { Container } from 'inversify'
import { TYPES } from '../../config/inversify.types'
import { CartController } from './controller/CartController'

export function init(app: Application, container: Container): void {
    const controller = container.get<CartController>(TYPES.Cart.Controller)
    controller.configureRoutes(app)
}