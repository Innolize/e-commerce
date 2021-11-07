import { Application, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { inject } from "inversify";
import { Multer } from "multer";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractController } from "../../../abstractClasses/abstractController";
import { bodyValidator } from "../../../common/helpers/bodyValidator";
import { Motherboard } from "../entity/Motherboard";
import { validateMotherboardAndProductDto, validateMotherboardEditDto, validateMotherboardQuerySchema } from "../helpers/dto-validator";
import { IMotherboard_Product_Form } from "../interface/IMotherboardCreate";
import { IMotherboardEdit } from '../interface/IMotherboardEdit'
import { jwtAuthentication } from "../../../auth/util/passportMiddlewares";
import { authorizationMiddleware } from "../../../authorization/util/authorizationMiddleware";
import { fromRequestToProduct } from "../../../product/mapper/productMapper";
import { fromRequestToMotherboardCreate } from "../mapper/motherboardMapper";
import { numberParamOrError } from "../../../common/helpers/numberParamOrError";
import { IMotherboardGetAllQueries } from "../interface/IMotherboardGetAllQueries";
import { GetMotherboardReqDto } from '../dto/getMotherboardsReqDto'
import { IProductService } from "../../../product/interfaces/IProductService";
import { IMotherboardService } from "../interface/IMotherboardService";
import { IImageUploadService } from "../../../imageUploader/interfaces/IImageUploadService";
import { BaseError } from "../../../common/error/BaseError";



export class MotherboardController extends AbstractController {
    private ROUTE_BASE: string
    private motherboardService: IMotherboardService;
    private uploadMiddleware: Multer
    private uploadService: IImageUploadService
    private productService: IProductService

    constructor(
        @inject(TYPES.PCBuilder.Motherboard.Service) motherboardService: IMotherboardService,
        @inject(TYPES.Common.UploadMiddleware) uploadMiddleware: Multer,
        @inject(TYPES.ImageUploader.Service) uploadService: IImageUploadService,
        @inject(TYPES.Product.Service) productService: IProductService
    ) {
        super()
        this.ROUTE_BASE = "/motherboard"
        this.motherboardService = motherboardService
        this.uploadMiddleware = uploadMiddleware
        this.uploadService = uploadService
        this.productService = productService
    }
    configureRoutes(app: Application): void {
        const ROUTE = this.ROUTE_BASE
        app.get(`/api${ROUTE}`, this.getAll.bind(this))
        app.get(`/api${ROUTE}/:id`, this.getSingle.bind(this))
        app.post(`/api${ROUTE}`, [jwtAuthentication, authorizationMiddleware({ action: 'create', subject: 'Motherboard' })], this.uploadMiddleware.single("product_image"), this.create.bind(this))
        app.put(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'update', subject: 'Motherboard' })], this.uploadMiddleware.none(), this.edit.bind(this))
        app.delete(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'delete', subject: 'Motherboard' })], this.delete.bind(this))
    }

    getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {
            const dto: IMotherboardGetAllQueries = req.query
            const { limit, offset, cpu_brand } = await bodyValidator(validateMotherboardQuerySchema, dto)
            const queryParam = new GetMotherboardReqDto(limit, offset, cpu_brand)
            const response = await this.motherboardService.getAll(queryParam)
            res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
        }
    }

    getSingle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params
            const validId = numberParamOrError(id)
            const response = await this.motherboardService.getSingle(validId)
            res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
            return
        }
    }

    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const MOTHERBOARD_CATEGORY = 3
        let productImage: string | undefined
        try {
            const dto: IMotherboard_Product_Form = req.body
            const validatedDto = await bodyValidator(validateMotherboardAndProductDto, dto)
            const newProduct = fromRequestToProduct({ ...validatedDto, id_category: MOTHERBOARD_CATEGORY })
            await this.productService.verifyCategoryAndBrandExistence(newProduct.id_category, newProduct.id_brand)
            if (req.file) {
                const upload = await this.uploadService.uploadProduct(req.file)
                newProduct.image = upload.Location
                productImage = upload.Location
            } else {
                newProduct.image = null
            }
            const newMotherboard = fromRequestToMotherboardCreate({ ...validatedDto, product: newProduct })
            const response = await this.motherboardService.create(newMotherboard)
            res.status(StatusCodes.CREATED).send(response)
        } catch (err) {
            if (productImage) {
                this.uploadService.deleteProduct(productImage)
            }
            next(err)
        }
    }

    edit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        let motherboard: Motherboard | undefined
        try {
            const { id } = req.params
            const validId = numberParamOrError(id)
            const dto: IMotherboardEdit = req.body
            const validatedDto = await bodyValidator(validateMotherboardEditDto, dto)
            BaseError.validateNonEmptyForm(validatedDto)
            motherboard = await this.motherboardService.modify(validId, validatedDto)
            res.status(StatusCodes.OK).send(motherboard)
        } catch (err) {
            next(err)
        }
    }

    delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params
            const validId = numberParamOrError(id)
            await this.motherboardService.delete(validId)
            res.status(StatusCodes.NO_CONTENT).send({ message: "Motherboard deleted successfully" })
        } catch (err) {
            next(err)
        }
    }
}