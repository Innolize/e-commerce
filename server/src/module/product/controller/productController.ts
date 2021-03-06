import { Application as App } from 'express'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../../config/inversify.types'
import { AbstractController } from '../../abstractClasses/abstractController'
import { ProductService } from '../service/productService'
import { Request, Response } from 'express'

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
        app.get(`${ROUTE}/:id`, this.index.bind(this))
        app.get(`${ROUTE}/findByName`, this.findProductByName.bind(this))
    }

    async index(req: Request, res: Response) {
        const { id } = req.params
        await this.productService.deleteProduct(Number(id))
    }

    findProductByName() {
        return "no implementado"
    }

}

export default ProductController