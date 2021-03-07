import { Application as App } from 'express'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../../config/inversify.types'
import { AbstractController } from '../../abstractClasses/abstractController'
import { ProductService } from '../service/productService'
import { Request, Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { Multer } from 'multer'
import { validateCreateProductDto } from '../helper/create_dto_validator'
import { bodyValidator, mapperMessageError } from '../../common/helpers/bodyValidator'
import { validateEditProductDto } from '../helper/edit_dto_validator'
import { Product } from '../entity/Product'
import { IProduct } from '../interfaces/IProduct'
import { IEditableProduct } from '../interfaces/IEditableProduct'

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

    configureRoutes(app: App): void {
        const ROUTE = this.ROUTE_BASE
        app.get(`${ROUTE}`, this.getAllProducts.bind(this))
        app.post(`${ROUTE}`, this.uploadMiddleware.single("bulbasaur"), this.createProduct.bind(this))
        app.put(`${ROUTE}`, this.modifyProduct.bind(this))
        app.delete(`${ROUTE}/:id`, this.deleteProduct.bind(this))
        app.get(`${ROUTE}/findByName/:name`, this.findProductByName.bind(this))
        app.get(`${ROUTE}/findById/:id`, this.findProductById.bind(this))
    }

    async getAllProducts(req: Request, res: Response): Promise<void> {
        try {
            const products = await this.productService.getAllProducts()
            res.status(StatusCodes.OK).send(products)
        } catch (err) {
            res.status(StatusCodes.NOT_FOUND).send('no se que poner')
        }
    }

    async createProduct(req: Request, res: Response): Promise<Response> {
        try {
            const dto: IProduct = req.body
            await bodyValidator(validateCreateProductDto, dto)
            const product = new Product(dto)
            const response = await this.productService.createProduct(product)
            return res.status(StatusCodes.OK).send(response)
        } catch (err) {
            if (err.isJoi === true) {
                const errorArray = mapperMessageError(err)
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({
                    errors: errorArray
                })
            }
            return res.send(err)
        }
    }

    async findProductByName(req: Request, res: Response): Promise<void> {
        const { name } = req.params
        if (!name) {
            throw Error("Query param 'name' is missing")
        }
        try {
            const response = await this.productService.findProductByName(name)
            res.status(StatusCodes.OK).send(response)
        } catch (err) {
            console.log('hubo un error')
        }

    }

    async findProductById(req: Request, res: Response): Promise<void> {
        const { id } = req.params
        console.log("id:", id)
        if (!id) {
            throw Error("Query param 'name' is missing")
        }
        try {
            const response = await this.productService.findProductById(Number(id))
            res.status(StatusCodes.OK).send(response)
        } catch (err) {
            res.status(StatusCodes.BAD_REQUEST).send({ errors: err.message })

        }
    }

    async modifyProduct(req: Request, res: Response): Promise<Response> {
        try {
            const dto: IEditableProduct = req.body
            await bodyValidator(validateEditProductDto, dto)
            const response = await this.productService.modifyProduct(dto)
            return res.status(StatusCodes.OK).send(response)
        } catch (err) {
            if (err.isJoi === true) {
                const errorArray = mapperMessageError(err)
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({
                    errors: errorArray
                })
            }
            return res.send(err)
        }
    }

    async deleteProduct(req: Request, res: Response): Promise<void> {
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