export { CartController } from './controller/CartController'
export { CartItemModel } from './model/CartItemModel'
export { CartModel } from './model/CartModel'

import { Application } from 'express'
import { Container } from 'inversify'
import { TYPES } from '../../config/inversify.types'
import { CartController } from './controller/CartController'

export function init(app: Application, container: Container): void {
    const controller = container.get<CartController>(TYPES.Cart.Controller)
    controller.configureRoutes(app)
}