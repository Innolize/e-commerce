import { Application as App, NextFunction } from 'express'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../../config/inversify.types'
import { AbstractController } from '../../abstractClasses/abstractController'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Multer } from 'multer'
import { BrandService } from '../service/brandService'
import { IBrandCreate } from '../interfaces/IBrandCreate'
import { Brand } from '../entity/Brand'
import { bodyValidator, mapperMessageError } from '../../common/helpers/bodyValidator'
import { validateCreateBrandDto } from '../helper/create_dto_validator'
import { IEditableBrand } from '../interfaces/IEditableBrand'
import { validateEditBrandDto } from '../helper/edit_dto_validator'
import { ImageUploadService } from '../../imageUploader/module'
import { authorizationMiddleware } from '../../authorization/util/authorizationMiddleware'
import { jwtAuthentication } from '../../auth/util/passportMiddlewares'
import { BrandError } from '../error/BrandError'
import { fromRequestToBrand } from '../mapper/brandMapper'


@injectable()
export class BrandController extends AbstractController {
    public ROUTE_BASE: string
    public brandService: BrandService
    public uploadMiddleware: Multer
    private uploadService: ImageUploadService
    constructor(
        @inject(TYPES.Brand.Service) brandService: BrandService,
        @inject(TYPES.Common.UploadMiddleware) uploadMiddleware: Multer,
        @inject(TYPES.ImageUploader.Service) uploadService: ImageUploadService
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
        app.put(`/api${ROUTE}`, [jwtAuthentication, authorizationMiddleware({ action: 'update', subject: 'Brand' })], this.uploadMiddleware.single("brand_logo"), this.modifyBrand.bind(this))
        app.delete(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'delete', subject: 'Brand' })], this.deleteBrand.bind(this))
        app.get(`/api${ROUTE}/:id`, this.findBrandById.bind(this))
    }

    async getAllBrands(req: Request, res: Response, next: NextFunction) {
        const { name } = req.query
        let queryParams: IGetAllBrandsQueries = {}
        name ? queryParams.name = String(name) : ''
        try {
            const products = await this.brandService.getAllCategories(queryParams)
            res.status(StatusCodes.OK).send(products)
        } catch (err) {
            next(err)
            return
        }
    }

    async createBrand(req: Request, res: Response, next: NextFunction) {
        let brandImage: string | undefined
        try {
            const dto: IBrandCreate = req.body
            const validatedDto = await bodyValidator(validateCreateBrandDto, dto)
            if (req.file) {
                const { buffer, originalname } = req.file
                const uploadedImage = await this.uploadService.uploadBrand(buffer, originalname)
                validatedDto.logo = uploadedImage.Location
                brandImage = uploadedImage.Location
            } else {
                validatedDto.logo = null
            }
            const brand = fromRequestToBrand(validatedDto)
            const response = await this.brandService.createBrand(brand)

            return res.status(StatusCodes.OK).send(response)
        } catch (err) {
            if (brandImage) {
                await this.uploadService.deleteBrand(brandImage)
            }
            next(err)
            return
        }
    }

    async findBrandById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        if (!id) {
            throw BrandError.missingId()
        }
        try {
            const response = await this.brandService.findBrandById(Number(id))
            res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
            return
        }
    }

    async modifyBrand(req: Request, res: Response, next: NextFunction) {
        let brandImage: string | undefined
        try {
            const dto: IEditableBrand = req.body
            const validatedDto = await bodyValidator(validateEditBrandDto, dto)
            if (req.file) {
                const { buffer, originalname } = req.file
                const uploadedImage = await this.uploadService.uploadBrand(buffer, originalname)
                validatedDto.logo = uploadedImage.Location
                brandImage = uploadedImage.Location
            }
            const response = await this.brandService.modifyBrand(validatedDto)
            return res.status(StatusCodes.OK).send(response)
        } catch (err) {
            if (brandImage) {
                await this.uploadService.deleteBrand(brandImage)
            }
            next(err)
            return
        }
    }

    async deleteBrand(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        try {
            const idNumber = Number(id)
            if (!idNumber || idNumber <= 0) {
                throw BrandError.invalidId()
            }
            const brand = await this.brandService.findBrandById(idNumber) as Brand
            await this.brandService.deleteBrand(Number(id))
            if (brand.logo) {
                await this.uploadService.deleteBrand(brand.logo)
            }
            res.status(StatusCodes.OK)
                .send({ message: "Product successfully deleted" })
        } catch (err) {
            next(err)
            return
        }
    }
}