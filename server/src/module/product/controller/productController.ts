import { Application as App, NextFunction } from 'express'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../../config/inversify.types'
import { AbstractController } from '../../abstractClasses/abstractController'
import { ProductService } from '../service/productService'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Multer } from 'multer'
import { validateCreateProductDto } from '../helper/create_dto_validator'
import { bodyValidator } from '../../common/helpers/bodyValidator'
import { validateEditProductDto } from '../helper/edit_dto_validator'
import { Product } from '../entity/Product'
import { IProductEdit } from '../interfaces/IProductEdit'
import { IProductCreate } from '../interfaces/IProductCreate'
import { ImageUploadService } from '../../imageUploader/module'
import { BrandService } from '../../brand/module'
import { CategoryService } from '../../category/module'
import { jwtAuthentication } from '../../auth/util/passportMiddlewares'
import { authorizationMiddleware } from '../../authorization/util/authorizationMiddleware'
import { ProductError } from '../error/ProductError'
import { fromRequestToProduct } from '../mapper/productMapper'
import { IProductGetAllQueries } from '../interfaces/IProductGetAllQueries'
import { validateGetProductDto } from '../helper/get_dto_validator'
import { GetProductsReqDto } from '../dto/getProductsReqDto'

@injectable()
export class ProductController extends AbstractController {
    private ROUTE_BASE: string
    private productService: ProductService
    private uploadMiddleware: Multer
    private uploadService: ImageUploadService
    private brandService: BrandService
    private categoryService: CategoryService

    constructor(
        @inject(TYPES.Product.Service) productService: ProductService,
        @inject(TYPES.Common.UploadMiddleware) uploadMiddleware: Multer,
        @inject(TYPES.ImageUploader.Service) uploadService: ImageUploadService,
        @inject(TYPES.Brand.Service) brandService: BrandService,
        @inject(TYPES.Category.Service) categoryService: CategoryService
    ) {
        super()
        this.ROUTE_BASE = "/product"
        this.productService = productService
        this.uploadMiddleware = uploadMiddleware
        this.uploadService = uploadService
        this.brandService = brandService
        this.categoryService = categoryService
    }

    configureRoutes(app: App): void {
        const ROUTE = this.ROUTE_BASE
        app.get(`/api${ROUTE}`, this.getAllProducts.bind(this))
        app.post(`/api${ROUTE}`, [jwtAuthentication, authorizationMiddleware({ action: 'create', subject: 'Product' })], this.uploadMiddleware.single('product_image'), this.createProduct.bind(this))
        app.put(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'update', subject: 'Product' })], this.uploadMiddleware.single('product_image'), this.modifyProduct.bind(this))
        app.delete(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'delete', subject: 'Product' })], this.deleteProduct.bind(this))
        app.get(`/api${ROUTE}/:id`, this.findProductById.bind(this))
    }

    async getAllProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const dto: IProductGetAllQueries = req.query
            const { category_id, limit, name, offset } = await bodyValidator(validateGetProductDto, dto)
            const queryParams = new GetProductsReqDto(limit, offset, name, category_id)
            const products = await this.productService.getAllProducts(queryParams)
            res.status(StatusCodes.OK).send(products)
        } catch (err) {
            next(err)
            return
        }
    }

    async createProduct(req: Request, res: Response, next: NextFunction) {
        let productImage: string | undefined
        try {
            const dto: IProductCreate = req.body
            const validatedDto = await bodyValidator(validateCreateProductDto, dto)
            if (req.file) {
                const { buffer, originalname } = req.file
                const uploadedImage = await this.uploadService.uploadProduct(buffer, originalname)
                validatedDto.image = uploadedImage.Location
                productImage = uploadedImage.Location
            } else {
                validatedDto.image = null
            }
            const product = fromRequestToProduct(validatedDto)
            const response = await this.productService.createProduct(product)
            return res.status(StatusCodes.OK).send(response)
        } catch (err) {
            if (productImage) {
                await this.uploadService.deleteProduct(productImage)
            }
            next(err)
            return
        }
    }

    async findProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params
        if (!id) {
            throw ProductError.nameMissing()
        }
        try {
            const response = await this.productService.findProductById(Number(id))
            res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
        }
    }

    async modifyProduct(req: Request, res: Response, next: NextFunction) {
        let productImage: string | undefined
        const { id } = req.params
        try {
            const idNumber = Number(id)
            if (!idNumber || idNumber <= 0) {
                throw ProductError.invalidId()
            }
            const dto: IProductEdit = req.body
            const validatedDto = await bodyValidator(validateEditProductDto, dto)
            if(!Object.keys(validatedDto).length){
                throw new Error('Update form cannot be empty!')
            }
            if (req.file) {
                const { buffer, originalname } = req.file
                const uploadedImage = await this.uploadService.uploadProduct(buffer, originalname)
                validatedDto.image = uploadedImage.Location
                productImage = uploadedImage.Location
            }
            const response = await this.productService.modifyProduct(Number(id), validatedDto) as Product
            return res.status(StatusCodes.OK).send(response)
        } catch (err) {
            if (productImage) {
                await this.uploadService.deleteProduct(productImage)
            }
            next(err)
            return
        }
    }

    async deleteProduct(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        try {
            const idNumber = Number(id)
            if (!idNumber || idNumber <= 0) {
                throw ProductError.invalidId()
            }
            const product = await this.productService.findProductById(idNumber) as Product
            await this.productService.deleteProduct(Number(id))
            if (product.image) {
                await this.uploadService.deleteProduct(product.image)
            }
            res.status(StatusCodes.OK).send({ message: "Product successfully deleted" })
        } catch (err) {
            next(err)
            return
        }
    }
}