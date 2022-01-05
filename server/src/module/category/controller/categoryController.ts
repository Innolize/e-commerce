import { Application as App, NextFunction } from 'express'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../../config/inversify.types'
import { AbstractController } from '../../abstractClasses/abstractController'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Multer } from 'multer'
import { ICategory } from '../interfaces/ICategory'
import { bodyValidator } from '../../common/helpers/bodyValidator'
import { validateCreateCategoryDto } from '../helper/create_dto_validator'
import { Category } from '../entity/Category'
import { ICategoryEdit } from '../interfaces/ICategoryEdit'
import { validateEditCategoryDto } from '../helper/edit_dto_validator'
import { jwtAuthentication } from '../../auth/util/passportMiddlewares'
import { authorizationMiddleware } from '../../authorization/util/authorizationMiddleware'
import { CategoryError } from '../error/CategoryError'
import { ICategoryGetAllQueries } from '../interfaces/ICategoryGetAllQueries'
import { validateGetCategoriesDto } from '../helper/get_dto_validator'
import { GetCategoriesReqDto } from '../dto/getCategoriesReqDto'
import { BaseError } from '../../common/error/BaseError'
import { ICategoryService } from '../interfaces/ICategoryService'

@injectable()
export class CategoryController extends AbstractController {
    private ROUTE_BASE: string
    constructor(
        @inject(TYPES.Category.Service) private categoryService: ICategoryService,
        @inject(TYPES.Common.UploadMiddleware) private uploadMiddleware: Multer
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
        app.put(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'update', subject: 'Category' })], this.uploadMiddleware.none(), this.modifyCategory.bind(this))
        app.delete(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'delete', subject: 'Category' })], this.deleteCategory.bind(this))
        app.get(`/api${ROUTE}/:id`, this.findCategoryById.bind(this))
    }

    async getAllCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
        const dto: ICategoryGetAllQueries = req.query
        try {
            const { limit, name, offset } = await bodyValidator(validateGetCategoriesDto, dto)
            const queryParams = new GetCategoriesReqDto(limit, offset, name)
            const products = await this.categoryService.getAllCategories(queryParams)
            res.status(StatusCodes.OK).send(products)
        } catch (err) {
            next(err)
        }
    }

    async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dto: ICategory = req.body
            const { name } = await bodyValidator(validateCreateCategoryDto, dto)
            const product = new Category(name)
            const response = await this.categoryService.createCategory(product)
            res.status(StatusCodes.CREATED).send(response)
        } catch (err) {
            next(err)
        }
    }

    async findCategoryById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params
            const idNumber = BaseError.validateNumber(id)
            const response = await this.categoryService.findCategoryById(idNumber)
            res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
        }
    }

    async modifyCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params
            const idNumber = BaseError.validateNumber(id)
            const dto: ICategoryEdit = req.body
            const validatedDto = await bodyValidator(validateEditCategoryDto, dto)
            const response = await this.categoryService.modifyCategory(idNumber, validatedDto)
            res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
        }
    }

    async deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {

        try {
            const { id } = req.params
            const idNumber = BaseError.validateNumber(id)
            if (idNumber <= 7) {
                throw CategoryError.undeletableCategory()
            }
            await this.categoryService.deleteCategory(idNumber)
            const SUCCESS_MESSAGE = "Category successfully deleted"
            res.status(StatusCodes.OK).send({ message: SUCCESS_MESSAGE })
        } catch (err) {
            next(err)
        }
    }
}