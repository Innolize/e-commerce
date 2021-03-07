import { Application as App } from 'express'
import { Container } from 'inversify';
import { TYPES } from '../../config/inversify.types';
import { CategoryController } from './controller/categoryController'
export * from './model/categoryModel'
export * from './controller/categoryController'
export * from './repository/categoryRepository'
export * from './service/categoryService'


export function init(app: App, container: Container): void {
    const controller = container.get<CategoryController>(TYPES.Category.Controller)
    controller.configureRoutes(app)
}

