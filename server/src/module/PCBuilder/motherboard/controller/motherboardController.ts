import { Application, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { inject } from "inversify";
import { Multer } from "multer";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractController } from "../../../abstractClasses/abstractController";
import { bodyValidator } from "../../../common/helpers/bodyValidator";
import { ImageUploadService } from "../../../imageUploader/module";
import { Motherboard } from "../entity/Motherboard";
import { validateMotherboardAndProductDto, validateMotherboardEditDto, validateMotherboardQuerySchema } from "../helpers/dto-validator";
import { IMotherboard_Product } from "../interface/IMotherboardCreate";
import { MotherboardService } from "../service/motherboardService";
import { IMotherboardEdit } from '../interface/IMotherboardEdit'
import { jwtAuthentication } from "../../../auth/util/passportMiddlewares";
import { authorizationMiddleware } from "../../../authorization/util/authorizationMiddleware";
import { fromRequestToProduct } from "../../../product/mapper/productMapper";
import { fromRequestToMotherboard } from "../mapper/motherboardMapper";
import { numberParamOrError } from "../../../common/helpers/numberParamOrError";
import { MotherboardError } from '../error/MotherboardError'
import { ProductService } from "../../../product/module";
import { IMotherboardGetAllQueries } from "../interface/IMotherboardGetAllQueries";
import { GetMotherboardReqDto } from '../dto/getMotherboardsReqDto'

export class MotherboardController extends AbstractController {
    private ROUTE_BASE: string
    private motherboardService: MotherboardService;
    private uploadMiddleware: Multer
    private uploadService: ImageUploadService
    private productService: ProductService

    constructor(
        @inject(TYPES.PCBuilder.Motherboard.Service) motherboardService: MotherboardService,
        @inject(TYPES.Common.UploadMiddleware) uploadMiddleware: Multer,
        @inject(TYPES.ImageUploader.Service) uploadService: ImageUploadService,
        @inject(TYPES.Product.Service) productService: ProductService
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
        app.get(`/api${ROUTE}/:id`, this.getSingleMotherboard.bind(this))
        app.post(`/api${ROUTE}`, [jwtAuthentication, authorizationMiddleware({ action: 'create', subject: 'Motherboard' })], this.uploadMiddleware.single("product_image"), this.create.bind(this))
        app.put(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'update', subject: 'Motherboard' })], this.uploadMiddleware.none(), this.edit.bind(this))
        app.delete(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'delete', subject: 'Motherboard' })], this.delete.bind(this))
    }

    getAll = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const dto: IMotherboardGetAllQueries = req.query
            const { limit, offset, cpu_brand } = await bodyValidator(validateMotherboardQuerySchema, dto)
            const queryParam = new GetMotherboardReqDto(limit, offset, cpu_brand)
            const response = await this.motherboardService.getMotherboards(queryParam)
            return res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
        }
    }

    getSingleMotherboard = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const params = req.params
            const validId = numberParamOrError(params, "id")
            const response = await this.motherboardService.getSingleMotherboards(validId) as Motherboard
            return res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
            return
        }
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        const MOTHERBOARD_CATEGORY = 3
        let productImage: string | undefined
        try {
            const dto: IMotherboard_Product = req.body
            const validatedDto = await bodyValidator(validateMotherboardAndProductDto, dto)
            const newMotherboard = fromRequestToMotherboard(validatedDto)
            const newProduct = fromRequestToProduct({ ...validatedDto, id_category: MOTHERBOARD_CATEGORY })
            await this.productService.verifyCategoryAndBrandExistence(newProduct.id_category, newProduct.id_brand)
            if (req.file) {
                const { buffer, originalname } = req.file
                const upload = await this.uploadService.uploadProduct(buffer, originalname)
                newProduct.image = upload.Location
                productImage = upload.Location
            } else {
                newProduct.image = null
            }
            const response = await this.motherboardService.createMotherboard(newProduct, newMotherboard)
            return res.status(StatusCodes.CREATED).send(response)
        } catch (err) {
            if (productImage) {
                this.uploadService.deleteProduct(productImage)
            }
            next(err)
        }
    }

    edit = async (req: Request, res: Response, next: NextFunction) => {
        let motherboard: Motherboard | undefined
        try {
            const dto: IMotherboardEdit = req.body
            const validatedDto = await bodyValidator(validateMotherboardEditDto, dto)
            motherboard = await this.motherboardService.modifyMotherboard(validatedDto) as Motherboard
            return res.status(StatusCodes.OK).send(motherboard)
        } catch (err) {
            next(err)
        }
    }

    delete = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params
        try {
            const idNumber = Number(id)
            if (!idNumber || idNumber <= 0) {
                throw MotherboardError.invalidId()
            }
            await this.motherboardService.deleteMotherboard(idNumber)
            return res.status(StatusCodes.NO_CONTENT).send({ message: "Motherboard deleted successfully" })
        } catch (err) {
            next(err)
        }
    }
}