import { Application, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { inject } from "inversify";
import { Multer } from "multer";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractController } from "../../../abstractClasses/abstractController";
import { bodyValidator } from "../../../common/helpers/bodyValidator";
import { Processor } from "../entities/Processor";
import { validateProcessorAndProductDto, validateProcessorEditDto, validateProcessorQuerySchema } from "../helpers/dto-validator";
import { IProcessor_Product_Form } from "../interface/IProcessorCreate";
import { IProcessorGetAllQuery } from "../interface/IProcessorQuery";
import { IProcessorEdit } from '../interface/IProcessorEdit'
import { numberParamOrError } from "../../../common/helpers/numberParamOrError";
import { jwtAuthentication } from "../../../auth/util/passportMiddlewares";
import { authorizationMiddleware } from "../../../authorization/util/authorizationMiddleware";
import { fromRequestToProduct } from "../../../product/mapper/productMapper";
import { GetProcessorReqDto } from "../dto/getProcessorReqDto";
import { IProcessorService } from "../interface/IProcessorService";
import { IImageUploadService } from "../../../imageUploader/interfaces/IImageUploadService";
import { IProductService } from "../../../product/interfaces/IProductService";
import { BaseError } from "../../../common/error/BaseError";
import { fromRequestToProcessorCreate } from "../mapper/processorMapper";

export class ProcessorController extends AbstractController {
    private ROUTE_BASE: string
    private processorService: IProcessorService;
    private uploadMiddleware: Multer
    private uploadService: IImageUploadService
    private productService: IProductService
    constructor(
        @inject(TYPES.PCBuilder.Processor.Service) processorService: IProcessorService,
        @inject(TYPES.Common.UploadMiddleware) uploadMiddleware: Multer,
        @inject(TYPES.ImageUploader.Service) uploadService: IImageUploadService,
        @inject(TYPES.Product.Service) productService: IProductService
    ) {
        super()
        this.ROUTE_BASE = "/processor"
        this.processorService = processorService
        this.uploadMiddleware = uploadMiddleware
        this.uploadService = uploadService
        this.productService = productService
    }
    configureRoutes(app: Application): void {
        const ROUTE = this.ROUTE_BASE
        app.get(`/api${ROUTE}`, this.getAll.bind(this))
        app.get(`/api${ROUTE}/:id`, this.getSingle.bind(this))
        app.post(`/api${ROUTE}`, [jwtAuthentication, authorizationMiddleware({ action: 'create', subject: 'Processor' })], this.uploadMiddleware.single("product_image"), this.create.bind(this))
        app.put(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'update', subject: 'Processor' })], this.uploadMiddleware.none(), this.edit.bind(this))
        app.delete(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'delete', subject: 'Processor' })], this.delete.bind(this))
    }

    getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const dto: IProcessorGetAllQuery = req.query
            const { offset, socket, limit } = await bodyValidator(validateProcessorQuerySchema, dto)
            const queryParams = new GetProcessorReqDto(limit, offset, socket)
            const response = await this.processorService.getAll(queryParams)
            res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
        }
    }

    getSingle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params
            const validId = numberParamOrError(id)
            const response = await this.processorService.getSingle(validId)
            res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
        }
    }

    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const PROCESSOR_CATEGORY = 5
        let productImage: string | undefined
        try {
            const dto: IProcessor_Product_Form = req.body
            const validatedDto = await bodyValidator(validateProcessorAndProductDto, dto)
            const newProduct = fromRequestToProduct({ ...validatedDto, id_category: PROCESSOR_CATEGORY })
            await this.productService.verifyCategoryAndBrandExistence(newProduct.id_category, newProduct.id_brand)
            if (req.file) {
                const upload = await this.uploadService.uploadProduct(req.file)
                newProduct.image = upload.Location
                productImage = upload.Location
            } else {
                newProduct.image = null
            }
            const newProcessor = fromRequestToProcessorCreate({ ...validatedDto, product: newProduct })
            const response = await this.processorService.create(newProcessor)
            res.status(StatusCodes.CREATED).send(response)
        } catch (err) {
            if (productImage) {
                this.uploadService.deleteProduct(productImage)
            }
            next(err)
        }
    }

    edit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        let processor: Processor | undefined
        try {
            const { id } = req.params
            const validId = numberParamOrError(id)
            const dto: IProcessorEdit = req.body
            const validatedDto = await bodyValidator(validateProcessorEditDto, dto)
            BaseError.validateNonEmptyForm(validatedDto)
            processor = await this.processorService.modify(validId, validatedDto)
            res.status(StatusCodes.OK).send(processor)
        } catch (err) {
            next(err)
        }
    }

    delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params
            const validId = numberParamOrError(id)
            await this.processorService.delete(validId)
            res.status(StatusCodes.NO_CONTENT).send({ message: "Product successfully deleted" })
        } catch (err) {
            next(err)
        }
    }
}