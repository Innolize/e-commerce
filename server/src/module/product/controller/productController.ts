import { Application as App } from 'express'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../../config/inversify.types'
import { AbstractController } from '../../abstractClasses/abstractController'
import { ProductService } from '../service/productService'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Multer } from 'multer'
import { validateCreateProductDto } from '../helper/create_dto_validator'
import { bodyValidator, mapperMessageError } from '../../common/helpers/bodyValidator'
import { validateEditProductDto } from '../helper/edit_dto_validator'
import { Product } from '../entity/Product'
import { IEditableProduct } from '../interfaces/IEditableProduct'
import { ICreateProduct } from '../interfaces/ICreateProduct'
import { ImageUploadService } from '../../imageUploader/module'
import { FullProduct } from '../entity/FullProduct'

@injectable()
export class ProductController extends AbstractController {
    private ROUTE_BASE: string
    private productService: ProductService
    private uploadMiddleware: Multer
    private uploadService: ImageUploadService

    constructor(
        @inject(TYPES.Product.Service) productService: ProductService,
        @inject(TYPES.Common.UploadMiddleware) uploadMiddleware: Multer,
        @inject(TYPES.ImageUploader.Service) uploadService: ImageUploadService
    ) {
        super()
        this.ROUTE_BASE = "/product"
        this.productService = productService
        this.uploadMiddleware = uploadMiddleware
        this.uploadService = uploadService
    }

    configureRoutes(app: App): void {
        const ROUTE = this.ROUTE_BASE
        app.get(`/api${ROUTE}`, this.getAllProducts.bind(this))
        app.post(`/api${ROUTE}`, this.uploadMiddleware.single('product_image'), this.createProduct.bind(this))
        app.put(`/api${ROUTE}`, this.uploadMiddleware.single('product_image'), this.modifyProduct.bind(this))
        app.delete(`/api${ROUTE}/:id`, this.deleteProduct.bind(this))
        app.get(`/api${ROUTE}/findByName/:name`, this.findProductByName.bind(this))
        app.get(`/api${ROUTE}/:id`, this.findProductById.bind(this))
    }

    async getAllProducts(req: Request, res: Response): Promise<void> {
        const products = await this.productService.getAllProducts()
        res.status(StatusCodes.OK).send(products)
    }

    async createProduct(req: Request, res: Response): Promise<Response> {
        let product: Product | undefined
        try {
            const dto: ICreateProduct = req.body
            const validatedDto = await bodyValidator(validateCreateProductDto, dto)
            if (req.file) {
                const uploadedImage = await this.uploadService.uploadProduct(req.file.buffer, req.file.originalname)
                validatedDto.image = uploadedImage.Location
            } else {
                validatedDto.image = null
            }
            product = new Product(validatedDto)
            const response = await this.productService.createProduct(product)
            return res.status(StatusCodes.OK).send(response)
        } catch (err) {
            if (err.isJoi === true) {
                const errorArray = mapperMessageError(err)
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({
                    errors: errorArray
                })
            }
            if (req.file && product?.image) {
                await this.uploadService.deleteProduct(product.image)
            }
            return res.status(StatusCodes.BAD_GATEWAY).send(err.message)
        }
    }

    async findProductByName(req: Request, res: Response): Promise<Error | Response> {
        const { name } = req.params
        if (!name) {
            throw Error("Query param 'name' is missing")
        }
        try {
            const response = await this.productService.findProductByName(name)
            return res.status(StatusCodes.OK).send(response)
        } catch (err) {
            throw Error(err.message)
        }
    }

    async findProductById(req: Request, res: Response): Promise<void> {
        const { id } = req.params
        if (!id) {
            throw Error("Query param 'name' is missing")
        }
        try {
            const response = await this.productService.findProductById(Number(id))
            res.status(StatusCodes.OK).send(response)
        } catch (err) {
            res.status(StatusCodes.BAD_REQUEST).send({ error: err.message })

        }
    }

    async modifyProduct(req: Request, res: Response): Promise<Response> {
        let product: IEditableProduct | undefined
        try {
            const dto: IEditableProduct = req.body
            const validatedDto = await bodyValidator(validateEditProductDto, dto)
            if (req.file) {
                const uploadedImage = await this.uploadService.uploadProduct(req.file.buffer, req.file.originalname)
                validatedDto.image = uploadedImage.Location
            } else {
                validatedDto.image = null
            }
            product = await this.productService.modifyProduct(validatedDto)
            return res.status(StatusCodes.OK).send(product)
        } catch (err) {
            if (err.isJoi === true) {
                const errorArray = mapperMessageError(err)
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({
                    errors: errorArray
                })
            }
            if (req.file && product?.image) {
                await this.uploadService.deleteProduct(product.image)
            }

            return res.status(StatusCodes.BAD_REQUEST).send({ message: err.message })
        }
    }

    async deleteProduct(req: Request, res: Response): Promise<void> {
        const { id } = req.params
        try {
            const product = await this.productService.findProductById(Number(id)) as FullProduct
            await this.productService.deleteProduct(Number(id))
            if (product.image) {
                await this.uploadService.deleteProduct(product.image)
            }
            res.status(StatusCodes.OK)
                .send({ message: "Product successfully deleted" })
        } catch (err) {
            res.status(StatusCodes.BAD_REQUEST).send({ message: err.message })
        }
    }
}