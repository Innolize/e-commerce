import { Application as App } from 'express'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../../config/inversify.types'
import { AbstractController } from '../../abstractClasses/abstractController'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Multer } from 'multer'
import { BrandService } from '../service/brandService'
import { IBrand } from '../interfaces/IBrand'
import { Brand } from '../entity/Brand'
import { bodyValidator, mapperMessageError } from '../../common/helpers/bodyValidator'
import { validateCreateBrandDto } from '../helper/create_dto_validator'
import { IEditableBrand } from '../interfaces/IEditableBrand'
import { validateEditBrandDto } from '../helper/edit_dto_validator'
import { ImageUploadService } from '../../imageUploader/module'


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
        app.post(`/api${ROUTE}`, this.uploadMiddleware.single("brand_logo"), this.createBrand.bind(this))
        app.put(`/api${ROUTE}`, this.uploadMiddleware.single("brand_logo"), this.modifyBrand.bind(this))
        app.delete(`/api${ROUTE}/:id`, this.deleteBrand.bind(this))
        app.get(`/api${ROUTE}/findByName/:name`, this.findBrandByName.bind(this))
        app.get(`/api${ROUTE}/findById/:id`, this.findBrandById.bind(this))
    }

    async getAllBrands(req: Request, res: Response): Promise<void> {
        const products = await this.brandService.getAllCategories()
        res.status(StatusCodes.OK).send(products)
    }

    async createBrand(req: Request, res: Response): Promise<Response> {
        let brand: IBrand | undefined
        try {
            const dto: IBrand = req.body
            const validatedDto = await bodyValidator(validateCreateBrandDto, dto)
            if (req.file) {
                const uploadedImage = await this.uploadService.uploadBrand(req.file.buffer, req.file.originalname)
                validatedDto.logo = uploadedImage.Location
            } else {
                validatedDto.logo = null
            }
            brand = new Brand(validatedDto)

            const response = await this.brandService.createBrand(brand)

            return res.status(StatusCodes.OK).send(response)
        } catch (err) {
            if (err.isJoi === true) {
                const errorArray = mapperMessageError(err)
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({
                    errors: errorArray
                })
            }
            if (req.file && brand && brand.logo) {
                await this.uploadService.deleteBrand(brand.logo)
            }

            return res.status(StatusCodes.BAD_GATEWAY).send(err.message)
        }
    }

    async findBrandByName(req: Request, res: Response): Promise<void> {
        const { name } = req.params
        if (!name) {
            throw Error("Query param 'name' is missing")
        }
        const response = await this.brandService.findBrandByName(name)
        res.status(StatusCodes.OK).send(response)
    }

    async findBrandById(req: Request, res: Response): Promise<void> {
        const { id } = req.params
        if (!id) {
            throw Error("Query param 'name' is missing")
        }
        try {
            const response = await this.brandService.findBrandById(Number(id))
            res.status(StatusCodes.OK).send(response)
        } catch (err) {
            res.status(StatusCodes.BAD_REQUEST).send({ message: err.message })

        }
    }

    async modifyBrand(req: Request, res: Response): Promise<Response> {
        let brand: IEditableBrand | undefined

        try {
            const dto: IEditableBrand = req.body
            brand = await bodyValidator(validateEditBrandDto, dto)
            if (req.file) {
                const uploadedImage = await this.uploadService.uploadProduct(req.file.buffer, req.file.originalname)
                brand.logo = uploadedImage.Location
            } else {
                brand.logo = null
            }
            const response = await this.brandService.modifyBrand(dto)
            return res.status(StatusCodes.OK).send(response)
        } catch (err) {
            if (err.isJoi === true) {
                const errorArray = mapperMessageError(err)
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({
                    errors: errorArray
                })
            }
            if (req.file && brand?.logo) {
                await this.uploadService.deleteBrand(brand.logo)
            }
            return res.status(StatusCodes.BAD_REQUEST).send({ message: err.message })
        }
    }

    async deleteBrand(req: Request, res: Response): Promise<void> {
        const { id } = req.params
        try {
            const brand = await this.brandService.findBrandById(Number(id)) as Brand
            await this.brandService.deleteBrand(Number(id))
            if (brand.logo) {
                await this.uploadService.deleteBrand(brand.logo)
            }
            res.status(StatusCodes.OK)
                .send({ message: "Product successfully deleted" })
        } catch (err) {
            res.status(StatusCodes.BAD_REQUEST).send({ message: err.message })
        }
    }
}