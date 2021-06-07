import { Application as App, NextFunction } from 'express'
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
import { CategoryError } from '../error/CategoryError'
import { IGetAllCategoriesQueries } from '../interfaces/IGetAllCategoriesQueries'


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
        app.get(`/api${ROUTE}/:id`, this.findCategoryById.bind(this))
    }

    async getAllCategories(req: Request, res: Response, next: NextFunction) {
        const { name } = req.query
        const queryParams: IGetAllCategoriesQueries = {}
        name ? queryParams.name = String(name) : ''
        try {
            const products = await this.categoryService.getAllCategories(queryParams)
            res.status(StatusCodes.OK).send(products)
        } catch (err) {
            next(err)
        }
    }

    async createCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const dto: ICategory = req.body
            const validatedDto = await bodyValidator(validateCreateCategoryDto, dto)
            const product = new Category(validatedDto)
            const response = await this.categoryService.createCategory(product)
            return res.status(StatusCodes.CREATED).send(response)
        } catch (err) {
            next(err)
        }
    }

    async findCategoryById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        try {
            if (!id) {
                throw CategoryError.invalidId()
            }
            const response = await this.categoryService.findCategoryById(Number(id))
            return res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
        }
    }

    async modifyCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const dto: IEditableCategory = req.body
            await bodyValidator(validateEditCategoryDto, dto)
            const response = await this.categoryService.modifyCategory(dto)
            return res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
        }
    }

    async deleteCategory(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        try {
            const idNumber = Number(id)
            if (!idNumber || idNumber <= 0) {
                throw CategoryError.invalidId()
            }
            if (idNumber <= 7) {
                throw CategoryError.undeletableCategory()
            }
            await this.categoryService.deleteCategory(Number(id))
            res.status(StatusCodes.OK).send({ message: "Category successfully deleted" })
        } catch (err) {
            next(err)
        }
    }
}