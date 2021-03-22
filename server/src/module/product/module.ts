import { Application as App } from 'express'
import { Container } from 'inversify';
import { TYPES } from '../../config/inversify.types';
import { ProductController } from './controller/productController';
export * from './controller/productController'
export * from './model/productModel'
export * from './repository/productRepository'
export * from './service/productService'


export function init(app: App, container: Container): void {
    const controller = container.get<ProductController>(TYPES.Product.Controller)
    controller.configureRoutes(app)
}

