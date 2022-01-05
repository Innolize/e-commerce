import { Application as App, NextFunction } from 'express'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../../config/inversify.types'
import { AbstractController } from '../../abstractClasses/abstractController'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Multer } from 'multer'
import { IBrandCreate } from '../interfaces/IBrandCreate'
import { bodyValidator } from '../../common/helpers/bodyValidator'
import { validateCreateBrandDto } from '../helper/create_dto_validator'
import { IBrandEdit } from '../interfaces/IBrandEdit'
import { validateEditBrandDto } from '../helper/edit_dto_validator'
import { authorizationMiddleware } from '../../authorization/util/authorizationMiddleware'
import { jwtAuthentication } from '../../auth/util/passportMiddlewares'
import { fromRequestToBrand } from '../mapper/brandMapper'
import { validateGetBrandsDto } from '../helper/get_dto_validator'
import { GetBrandsReqDto } from '../dto/getBrandsReqDto'
import { BaseError } from '../../common/error/BaseError'
import { IBrandService } from '../interfaces/IBrandService'
import { IImageUploadService } from '../../imageUploader/interfaces/IImageUploadService'

@injectable()
export class BrandController extends AbstractController {
    private ROUTE_BASE: string
    constructor(
        @inject(TYPES.Brand.Service) private brandService: IBrandService,
        @inject(TYPES.Common.UploadMiddleware) private uploadMiddleware: Multer,
        @inject(TYPES.ImageUploader.Service) private uploadService: IImageUploadService
    ) {
        super()
        this.ROUTE_BASE = "/brand"
        this.brandService = brandService
        this.uploadMiddleware = uploadMiddleware
        this.uploadService = uploadService
    }

    configureRoutes(app: App): void {
        const ROUTE = this.ROUTE_BASE
        app.get(`/api${ROUTE}`, this.getAllBrands.bind(this))
        app.post(`/api${ROUTE}`, [jwtAuthentication, authorizationMiddleware({ action: 'create', subject: 'Brand' })], this.uploadMiddleware.single("brand_logo"), this.createBrand.bind(this))
        app.put(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'update', subject: 'Brand' })], this.uploadMiddleware.single("brand_logo"), this.modifyBrand.bind(this))
        app.delete(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'delete', subject: 'Brand' })], this.deleteBrand.bind(this))
        app.get(`/api${ROUTE}/:id`, this.findBrandById.bind(this))
    }

    async getAllBrands(req: Request, res: Response, next: NextFunction): Promise<void> {
        const dto: IBrandGetAllQueries = req.query
        try {
            const { limit, offset, name } = await bodyValidator(validateGetBrandsDto, dto)
            const queryParams = new GetBrandsReqDto(limit, offset, name)
            const products = await this.brandService.getAllBrands(queryParams)
            res.status(StatusCodes.OK).send(products)
        } catch (err) {
            next(err)
        }
    }

    async createBrand(req: Request, res: Response, next: NextFunction): Promise<void> {
        let brandImage: string | undefined
        try {
            const dto: IBrandCreate = req.body
            const validatedDto = await bodyValidator(validateCreateBrandDto, dto)
            if (req.file) {
                const uploadedImage = await this.uploadService.uploadBrand(req.file)
                validatedDto.logo = uploadedImage.Location
                brandImage = uploadedImage.Location
            } else {
                validatedDto.logo = null
            }
            const brand = fromRequestToBrand(validatedDto)
            const response = await this.brandService.createBrand(brand)

            res.status(StatusCodes.OK).send(response)
        } catch (err) {
            if (brandImage) {
                await this.uploadService.deleteBrand(brandImage)
            }
            next(err)
        }
    }

    async findBrandById(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params
        try {
            const brandId = BaseError.validateNumber(id)
            const response = await this.brandService.findBrandById(brandId)
            res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
        }
    }

    async modifyBrand(req: Request, res: Response, next: NextFunction): Promise<void> {
        let brandImage: string | undefined
        try {
            const dto: IBrandEdit = req.body
            const { id } = req.params
            const brandId = BaseError.validateNumber(id)
            const validatedDto = await bodyValidator(validateEditBrandDto, dto)
            if (req.file) {
                const uploadedImage = await this.uploadService.uploadBrand(req.file)
                validatedDto.logo = uploadedImage.Location
                brandImage = uploadedImage.Location
            }
            const response = await this.brandService.modifyBrand(brandId, validatedDto)
            res.status(StatusCodes.OK).send(response)
        } catch (err) {
            if (brandImage) {
                await this.uploadService.deleteBrand(brandImage)
            }
            next(err)
        }
    }

    async deleteBrand(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params
        try {
            const brandId = BaseError.validateNumber(id)
            const brand = await this.brandService.findBrandById(brandId)
            await this.brandService.deleteBrand(brandId)
            if (brand.logo) {
                await this.uploadService.deleteBrand(brand.logo)
            }
            const SUCCESS_MESSAGE = "Product successfully deleted"
            res.status(StatusCodes.OK).send({ message: SUCCESS_MESSAGE })
        } catch (err) {
            next(err)
        }
    }
}