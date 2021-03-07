import { Application as App } from 'express'
import { Container } from 'inversify';
import { TYPES } from '../../config/inversify.types';
import { BrandController } from './controller/brandController'
export * from './model/brandModel'
export * from './controller/brandController'
export * from './repository/brandRepository'
export * from './service/brandService'

export function init(app: App, container: Container): void {
    const controller = container.get<BrandController>(TYPES.Brand.Controller)
    controller.configureRoutes(app)
}

