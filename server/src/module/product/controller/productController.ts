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
        app.get(`${ROUTE}`, this.index.bind(this))
        app.post(`${ROUTE}`, this.createProduct.bind(this))
        app.get(`${ROUTE}/:id`, this.findProductById.bind(this))
        app.get(`${ROUTE}/findByName/:name`, this.findProductByName.bind(this))
        app.delete(`${ROUTE}/:id`, this.deleteProduct.bind(this))

    }

    async index(req: Request, res: Response) {
        console.log("123")
        res.send('no implementado')
        return "no implementado"
    }

    async createProduct(req: Request, res: Response) {
        return "no implementado"
    }

    async findProductByName(req: Request, res: Response) {
        return "no implementado"
    }

    async findProductById(req: Request, res: Response) {
        return "no implementado"
    }

    async updateProduct(req: Request, res: Response) {
        return "no implementado"
    }

    async deleteProduct(req: Request, res: Response) {
        const { id } = req.params
        await this.productService.deleteProduct(Number(id))

    }


}

export default ProductController