import { Application as App } from 'express'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../../config/inversify.types'
import { AbstractController } from '../../abstractClasses/abstractController'
import { ProductService } from '../service/productService'
import { Request, Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { Multer } from 'multer'

@injectable()
class ProductController extends AbstractController {
    public ROUTE_BASE: string
    public productService: ProductService
    public uploadMiddleware: Multer
    constructor(
        @inject(TYPES.ProductService) productService: ProductService,
        @inject(TYPES.UploadMiddleware) uploadMiddleware: Multer
    ) {
        super()
        this.ROUTE_BASE = "/product"
        this.productService = productService
        this.uploadMiddleware = uploadMiddleware
    }

    configureRoutes(app: App) {
        const ROUTE = this.ROUTE_BASE
        app.get(`${ROUTE}`, this.getAllProducts.bind(this))
        app.post(`${ROUTE}`, this.uploadMiddleware.single("bulbasaur"), this.createProduct.bind(this))
        app.get(`${ROUTE}/:id`, this.findProductById.bind(this))
        app.get(`${ROUTE}/findByName/:name`, this.findProductByName.bind(this))
        app.delete(`${ROUTE}/:id`, this.deleteProduct.bind(this))

    }

    async getAllProducts(req: Request, res: Response) {
        res
            .status(StatusCodes.OK)
            .send({ message: "success!" })
        // return "no implementado"
    }

    async createProduct(req: Request, res: Response) {
        console.log(req.body)
        // await this.productService.createProduct
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
        try {
            await this.productService.deleteProduct(Number(id))
            res.status(StatusCodes.OK)
                .send({ message: "Product successfully deleted" })
        } catch (e) {
            res.status(StatusCodes.BAD_REQUEST).send({ message: ReasonPhrases.BAD_REQUEST })
        }
    }
}

export default ProductController