import { Application, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { inject } from "inversify";
import { Multer } from "multer";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractController } from "../../../abstractClasses/abstractController";
import { bodyValidator } from "../../../common/helpers/bodyValidator";
import { ImageUploadService } from "../../../imageUploader/module";
import { Processor } from "../entities/Processor";
import { validateProcessorAndProductDto, validateProcessorEditDto, validateProcessorQuerySchema } from "../helpers/dto-validator";
import { IProcessor_Product } from "../interface/IProcessorCreate";
import { IProcessorQuery } from "../interface/IProcessorQuery";
import { IProcessorEdit } from '../interface/IProcessorEdit'
import { ProcessorService } from "../service/ProcessorService";
import { idNumberOrError } from "../../../common/helpers/idNumberOrError";
import { jwtAuthentication } from "../../../auth/util/passportMiddlewares";
import { authorizationMiddleware } from "../../../authorization/util/authorizationMiddleware";
import { fromRequestToProduct } from "../../../product/mapper/productMapper";
import { fromRequestToProcessor } from "../mapper/processorMapper";
import { ProductService } from "../../../product/module";
import { ProcessorError } from "../error/ProcessorError";

export class ProcessorController extends AbstractController {
    private ROUTE_BASE: string
    private processorService: ProcessorService;
    private uploadMiddleware: Multer
    private uploadService: ImageUploadService
    private productService: ProductService
    constructor(
        @inject(TYPES.PCBuilder.Processor.Service) processorService: ProcessorService,
        @inject(TYPES.Common.UploadMiddleware) uploadMiddleware: Multer,
        @inject(TYPES.ImageUploader.Service) uploadService: ImageUploadService,
        @inject(TYPES.Product.Service) productService: ProductService
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
        app.get(`/api${ROUTE}/:id`, this.getSingleProcessor.bind(this))
        app.post(`/api${ROUTE}`, [jwtAuthentication, authorizationMiddleware({ action: 'create', subject: 'Processor' })], this.uploadMiddleware.single("product_image"), this.create.bind(this))
        app.put(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'update', subject: 'Processor' })], this.uploadMiddleware.none(), this.edit.bind(this))
        app.delete(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'delete', subject: 'Processor' })], this.delete.bind(this))
    }

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        const queryDto = req.query
        try {
            const hasQuery = Object.keys(queryDto).length
            if (hasQuery) {
                const validQueryDto = await bodyValidator(validateProcessorQuerySchema, queryDto as IProcessorQuery)
                const ProcessorWithQuery = await this.processorService.getprocessors(validQueryDto)
                return res.status(StatusCodes.OK).send(ProcessorWithQuery)
            }
            const response = await this.processorService.getprocessors()
            return res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
        }
    }

    getSingleProcessor = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params
            const validId = idNumberOrError(id) as number
            const response = await this.processorService.getSingleProcessor(validId) as Processor
            return res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
        }
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        const PROCESSOR_CATEGORY = 5
        let productImage: string | undefined
        try {
            const dto: IProcessor_Product = req.body
            const validatedDto = await bodyValidator(validateProcessorAndProductDto, dto)
            const newMotherboard = fromRequestToProcessor(validatedDto)
            const newProduct = fromRequestToProduct({ ...validatedDto, id_category: PROCESSOR_CATEGORY })
            await this.productService.verifyCategoryAndBrandExistence(newProduct.id_category, newProduct.id_brand)
            if (req.file) {
                const { buffer, originalname } = req.file
                const upload = await this.uploadService.uploadProduct(buffer, originalname)
                newProduct.image = upload.Location
                productImage = upload.Location
            } else {
                newProduct.image = null
            }
            const response = await this.processorService.createprocessors(newProduct, newMotherboard)
            return res.status(StatusCodes.CREATED).send(response)
        } catch (err) {
            if (productImage) {
                this.uploadService.deleteProduct(productImage)
            }
            next(err)
        }
    }

    edit = async (req: Request, res: Response, next: NextFunction) => {
        let processor: Processor | undefined
        try {
            const { id } = req.params
            const validId = idNumberOrError(id) as number
            const dto: IProcessorEdit = req.body
            const validatedDto = await bodyValidator(validateProcessorEditDto, dto)
            processor = await this.processorService.modifyprocessors(validId, validatedDto) as Processor
            return res.status(StatusCodes.OK).send(processor)
        } catch (err) {
            next(err)
        }
    }

    delete = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params
        try {
            const idNumber = Number(id)
            if (!idNumber || idNumber <= 0) {
                throw ProcessorError.invalidId()
            }
            await this.processorService.deleteprocessors(idNumber)
            return res.status(StatusCodes.NO_CONTENT).send({ message: "Product successfully deleted" })
        } catch (err) {
            next(err)
        }
    }
}