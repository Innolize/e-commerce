import { Application as App, NextFunction } from 'express'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../../config/inversify.types'
import { AbstractController } from '../../abstractClasses/abstractController'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Multer } from 'multer'
import { validateCreateProductDto } from '../helper/create_dto_validator'
import { bodyValidator } from '../../common/helpers/bodyValidator'
import { validateEditProductDto } from '../helper/edit_dto_validator'
import { IProductEdit } from '../interfaces/IProductEdit'
import { IProductCreate } from '../interfaces/IProductCreate'
import { jwtAuthentication } from '../../auth/util/passportMiddlewares'
import { authorizationMiddleware } from '../../authorization/util/authorizationMiddleware'
import { fromRequestToProduct } from '../mapper/productMapper'
import { IProductGetAllQueries } from '../interfaces/IProductGetAllQueries'
import { validateGetProductDto } from '../helper/get_dto_validator'
import { GetProductsReqDto } from '../dto/getProductsReqDto'
import { IProductService } from '../interfaces/IProductService'
import { IImageUploadService } from '../../imageUploader/interfaces/IImageUploadService'
import { BaseError } from '../../common/error/BaseError'

@injectable()
export class ProductController extends AbstractController {
    private ROUTE_BASE: string
    constructor(
        @inject(TYPES.Product.Service) private productService: IProductService,
        @inject(TYPES.Common.UploadMiddleware) private uploadMiddleware: Multer,
        @inject(TYPES.ImageUploader.Service) private uploadService: IImageUploadService,
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
        app.post(`/api${ROUTE}`, [jwtAuthentication, authorizationMiddleware({ action: 'create', subject: 'Product' })], this.uploadMiddleware.single('product_image'), this.createProduct.bind(this))
        app.put(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'update', subject: 'Product' })], this.uploadMiddleware.single('product_image'), this.modifyProduct.bind(this))
        app.delete(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'delete', subject: 'Product' })], this.deleteProduct.bind(this))
        app.get(`/api${ROUTE}/:id`, this.findProductById.bind(this))
    }

    async getAllProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dto: IProductGetAllQueries = req.query
            const { category_id, limit, name, offset } = await bodyValidator(validateGetProductDto, dto)
            const queryParams = new GetProductsReqDto(limit, offset, name, category_id)
            const products = await this.productService.getAllProducts(queryParams)
            res.status(StatusCodes.OK).send(products)
        } catch (err) {
            next(err)
        }
    }

    async createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        let productImage: string | undefined
        try {
            const dto: IProductCreate = req.body
            const validatedDto = await bodyValidator(validateCreateProductDto, dto)
            if (req.file) {
                const uploadedImage = await this.uploadService.uploadProduct(req.file)
                validatedDto.image = uploadedImage.Location
                productImage = uploadedImage.Location
            } else {
                validatedDto.image = null
            }
            const product = fromRequestToProduct(validatedDto)
            const response = await this.productService.createProduct(product)
            res.status(StatusCodes.OK).send(response)
        } catch (err) {
            if (productImage) {
                await this.uploadService.deleteProduct(productImage)
            }
            next(err)
        }
    }

    async findProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params
        try {
            const idNumber = BaseError.validateNumber(id)
            const response = await this.productService.findProductById(idNumber)
            res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
        }
    }

    async modifyProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        let productImage: string | undefined
        const { id } = req.params
        try {
            const idNumber = BaseError.validateNumber(id)
            const dto: IProductEdit = req.body
            const validatedDto = await bodyValidator(validateEditProductDto, dto)
            BaseError.validateNonEmptyForm(validatedDto)
            if (req.file) {
                const uploadedImage = await this.uploadService.uploadProduct(req.file)
                validatedDto.image = uploadedImage.Location
                productImage = uploadedImage.Location
            }
            const response = await this.productService.modifyProduct(idNumber, validatedDto)
            res.status(StatusCodes.OK).send(response)
        } catch (err) {
            if (productImage) {
                await this.uploadService.deleteProduct(productImage)
            }
            next(err)
        }
    }

    async deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params
        try {
            const idNumber = BaseError.validateNumber(id)
            const product = await this.productService.findProductById(idNumber)
            await this.productService.deleteProduct(idNumber)
            if (product.image) {
                await this.uploadService.deleteProduct(product.image)
            }
            const SUCCESS_MESSAGE = "Product successfully deleted"
            res.status(StatusCodes.OK).send({ message: SUCCESS_MESSAGE })
        } catch (err) {
            next(err)
        }
    }
}