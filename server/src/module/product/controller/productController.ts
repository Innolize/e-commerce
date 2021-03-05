import { Application as App } from 'express'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../../config/inversify.types'
import { AbstractController } from '../../abstractClasses/abstractController'
import { ProductService } from '../service/productService'

@injectable()
class ProductController extends AbstractController {
    public ROUTE_BASE: string
    public productService: ProductService
    constructor(
        @inject(TYPES.ProductService) productService: ProductService
    ) {
        super()
        this.ROUTE_BASE = "/product"
        this.productService = productService
    }

    configureRoutes(app: App) {
        const ROUTE = this.ROUTE_BASE
        app.get(`${ROUTE}`, this.index.bind(this))
        app.get(`${ROUTE}/findByName`, this.findProductByName.bind(this))
    }

    async index() {
        await this.productService.test()
    }

    findProductByName() {
        return "no implementado"
    }

}

export default ProductController