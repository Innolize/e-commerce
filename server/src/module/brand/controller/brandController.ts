import { Application as App } from 'express'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../../config/inversify.types'
import { AbstractController } from '../../abstractClasses/abstractController'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Multer } from 'multer'
import { BrandService } from '../service/brandService'
import { IBrand } from '../interfaces/IBrand'
import { Brand } from '../entity/Category'
import { bodyValidator, mapperMessageError } from '../../common/helpers/bodyValidator'
import { validateCreateBrandDto } from '../helper/create_dto_validator'
import { IEditableBrand } from '../interfaces/IEditableBrand'
import { validateEditBrandDto } from '../helper/edit_dto_validator'


@injectable()
export class BrandController extends AbstractController {
    public ROUTE_BASE: string
    public brandService: BrandService
    public uploadMiddleware: Multer
    constructor(
        @inject(TYPES.Brand.Service) brandService: BrandService,
        @inject(TYPES.Common.UploadMiddleware) uploadMiddleware: Multer
    ) {
        super()
        this.ROUTE_BASE = "/brand"
        this.brandService = brandService
        this.uploadMiddleware = uploadMiddleware
    }

    configureRoutes(app: App): void {
        const ROUTE = this.ROUTE_BASE
        app.get(`${ROUTE}`, this.getAllBrands.bind(this))
        app.post(`${ROUTE}`, this.uploadMiddleware.single("bulbasaur"), this.createBrand.bind(this))
        app.put(`${ROUTE}`, this.modifyBrand.bind(this))
        app.delete(`${ROUTE}/:id`, this.deleteBrand.bind(this))
        app.get(`${ROUTE}/findByName/:name`, this.findBrandByName.bind(this))
        app.get(`${ROUTE}/findById/:id`, this.findBrandById.bind(this))
    }

    async getAllBrands(req: Request, res: Response): Promise<void> {

        try {

            const products = await this.brandService.getAllCategories()
            console.log(products)
            res.status(StatusCodes.OK).send(products)
        } catch (err) {
            console.log(err)
            res.status(StatusCodes.NOT_FOUND).send('no se que poner')
        }
    }

    async createBrand(req: Request, res: Response): Promise<Response> {
        try {

            const dto: IBrand = req.body
            const validatedDto = await bodyValidator(validateCreateBrandDto, dto)
            const product = new Brand(validatedDto)

            const response = await this.brandService.createBrand(product)

            return res.status(StatusCodes.OK).send(response)
        } catch (err) {
            console.log(err)
            if (err.isJoi === true) {
                const errorArray = mapperMessageError(err)
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({
                    errors: errorArray
                })
            }
            return res.send(err)
        }
    }

    async findBrandByName(req: Request, res: Response): Promise<void> {
        const { name } = req.params
        if (!name) {
            throw Error("Query param 'name' is missing")
        }
        try {
            const response = await this.brandService.findBrandByName(name)
            res.status(StatusCodes.OK).send(response)
        } catch (err) {
            console.log('hubo un error')
        }
    }

    async findBrandById(req: Request, res: Response): Promise<void> {
        const { id } = req.params
        console.log("id:", id)
        if (!id) {
            throw Error("Query param 'name' is missing")
        }
        try {
            const response = await this.brandService.findBrandById(Number(id))
            res.status(StatusCodes.OK).send(response)
        } catch (err) {
            res.status(StatusCodes.BAD_REQUEST).send({ errors: err.message })

        }
    }

    async modifyBrand(req: Request, res: Response): Promise<Response> {
        try {
            const dto: IEditableBrand = req.body
            await bodyValidator(validateEditBrandDto, dto)
            const response = await this.brandService.modifyBrand(dto)
            return res.status(StatusCodes.OK).send(response)
        } catch (err) {
            if (err.isJoi === true) {
                const errorArray = mapperMessageError(err)
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({
                    errors: errorArray
                })
            }
            return res.status(StatusCodes.BAD_REQUEST).send(err)
        }
    }

    async deleteBrand(req: Request, res: Response): Promise<void> {
        const { id } = req.params
        try {
            await this.brandService.deleteBrand(Number(id))
            res.status(StatusCodes.OK)
                .send({ message: "Product successfully deleted" })
        } catch (err) {
            res.status(StatusCodes.BAD_REQUEST).send({ message: err.message })
        }
    }
}