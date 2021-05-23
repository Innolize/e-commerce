import { Application as App } from 'express'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../../config/inversify.types'
import { AbstractController } from '../../abstractClasses/abstractController'
import { Request, Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { Multer } from 'multer'
import { CategoryService } from '../service/categoryService'
import { ICategory } from '../interfaces/ICategory'
import { bodyValidator, mapperMessageError } from '../../common/helpers/bodyValidator'
import { validateCreateCategoryDto } from '../helper/create_dto_validator'
import { Category } from '../entity/Category'
import { IEditableCategory } from '../interfaces/IEditableCategory'
import { validateEditCategoryDto } from '../helper/edit_dto_validator'
import { jwtAuthentication } from '../../auth/util/passportMiddlewares'
import { authorizationMiddleware } from '../../authorization/util/authorizationMiddleware'


@injectable()
export class CategoryController extends AbstractController {
    public ROUTE_BASE: string
    public categoryService: CategoryService
    public uploadMiddleware: Multer
    constructor(
        @inject(TYPES.Category.Service) categoryService: CategoryService,
        @inject(TYPES.Common.UploadMiddleware) uploadMiddleware: Multer
    ) {
        super()
        this.ROUTE_BASE = "/category"
        this.categoryService = categoryService
        this.uploadMiddleware = uploadMiddleware
    }

    configureRoutes(app: App): void {
        const ROUTE = this.ROUTE_BASE
        app.get(`/api${ROUTE}`, this.getAllCategories.bind(this))
        app.post(`/api${ROUTE}`, [jwtAuthentication, authorizationMiddleware({ action: 'create', subject: 'Category' })], this.uploadMiddleware.single("bulbasaur"), this.createCategory.bind(this))
        app.put(`/api${ROUTE}`, [jwtAuthentication, authorizationMiddleware({ action: 'update', subject: 'Category' })], this.uploadMiddleware.none(), this.modifyCategory.bind(this))
        app.delete(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'delete', subject: 'Category' })], this.deleteCategory.bind(this))
        app.get(`/api${ROUTE}/findByName/:name`, this.findCategoryByName.bind(this))
        app.get(`/api${ROUTE}/findById/:id`, this.findCategoryById.bind(this))
    }

    async getAllCategories(req: Request, res: Response): Promise<void> {

        try {

            const products = await this.categoryService.getAllCategories()
            res.status(StatusCodes.OK).send(products)
        } catch (err) {
            res.status(StatusCodes.NOT_FOUND).send('no se que poner')
        }
    }

    async createCategory(req: Request, res: Response): Promise<Response> {
        try {
            const dto: ICategory = req.body
            console.log(dto)
            const validatedDto = await bodyValidator(validateCreateCategoryDto, dto)
            const product = new Category(validatedDto)
            const response = await this.categoryService.createCategory(product)
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

    async findCategoryByName(req: Request, res: Response): Promise<void> {
        const { name } = req.params
        if (!name) {
            throw Error("Query param 'name' is missing")
        }
        try {
            const response = await this.categoryService.findProductByName(name)
            res.status(StatusCodes.OK).send(response)
        } catch (err) {
            console.log('hubo un error')
        }

    }

    async findCategoryById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params
        console.log("id:", id)
        if (!id) {
            throw Error("Query param 'name' is missing")
        }
        try {
            const response = await this.categoryService.findCategoryById(Number(id))
            return res.status(StatusCodes.OK).send(response)
        } catch (err) {
            return res.status(StatusCodes.BAD_REQUEST).send({ errors: err.message })

        }
    }

    async modifyCategory(req: Request, res: Response): Promise<Response> {
        console.log(req.body)
        try {
            const dto: IEditableCategory = req.body
            console.log(req.body)
            await bodyValidator(validateEditCategoryDto, dto)
            const response = await this.categoryService.modifyCategory(dto)
            return res.status(StatusCodes.OK).send(response)
        } catch (err) {
            if (err.isJoi === true) {
                const errorArray = mapperMessageError(err)
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({
                    errors: errorArray
                })
            }
            console.log(err)
            return res.status(StatusCodes.NOT_FOUND).send({ message: err.message })
        }
    }

    async deleteCategory(req: Request, res: Response): Promise<void> {
        const { id } = req.params
        if (!id && id !== "0") {
            throw Error('missing id')
        }
        try {
            await this.categoryService.deleteCategory(Number(id))
            res.status(StatusCodes.OK)
                .send({ message: "Product successfully deleted" })
        } catch (e) {
            res.status(StatusCodes.BAD_REQUEST).send({ message: ReasonPhrases.BAD_REQUEST })
        }
    }
}