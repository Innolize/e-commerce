import { Application as App } from 'express'
import { Container } from 'inversify';
import { TYPES } from '../../config/inversify.types';
import ProductController from './controller/productController';
import ProductModel from './model/productModel'


export function init(app: App, container: Container) {
    const controller = container.get<ProductController>(TYPES.ProductController)
    controller.configureRoutes(app)
}

