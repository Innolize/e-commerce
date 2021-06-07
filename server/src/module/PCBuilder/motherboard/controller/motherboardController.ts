import { Application, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { inject } from "inversify";
import { Multer } from "multer";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractController } from "../../../abstractClasses/abstractController";
import { bodyValidator } from "../../../common/helpers/bodyValidator";
import { ImageUploadService } from "../../../imageUploader/module";
import { Motherboard } from "../entity/Motherboard";
import { validateMotherboardAndProductDto, validateMotherboardEditDto, validateQueryCpuBrand } from "../helpers/dto-validator";
import { IMotherboard_Product } from "../interface/IMotherboardCreate";
import { MotherboardService } from "../service/motherboardService";
import { IMotherboardEdit } from '../interface/IMotherboardEdit'
import { jwtAuthentication } from "../../../auth/util/passportMiddlewares";
import { authorizationMiddleware } from "../../../authorization/util/authorizationMiddleware";
import { fromRequestToProduct } from "../../../product/mapper/productMapper";
import { fromRequestToMotherboard } from "../mapper/motherboardMapper";
import { idNumberOrError } from "../../../common/helpers/idNumberOrError";
import { MotherboardError } from '../error/MotherboardError'

export class MotherboardController extends AbstractController {
    private ROUTE_BASE: string
    private motherboardService: MotherboardService;
    private uploadMiddleware: Multer
    private uploadService: ImageUploadService
    constructor(
        @inject(TYPES.PCBuilder.Motherboard.Service) motherboardService: MotherboardService,
        @inject(TYPES.Common.UploadMiddleware) uploadMiddleware: Multer,
        @inject(TYPES.ImageUploader.Service) uploadService: ImageUploadService
    ) {
        super()
        this.ROUTE_BASE = "/motherboard"
        this.motherboardService = motherboardService
        this.uploadMiddleware = uploadMiddleware
        this.uploadService = uploadService
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
        const { cpu_brand } = req.query
        try {
            if (cpu_brand) {
                const valid_cpu_brand = validateQueryCpuBrand(cpu_brand.toString())
                const motherboardWithQuery = await this.motherboardService.getMotherboards(valid_cpu_brand)
                return res.status(StatusCodes.OK).send(motherboardWithQuery)
            }
            const response = await this.motherboardService.getMotherboards()
            return res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
        }
    }

    getSingleMotherboard = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params
            const validId = idNumberOrError(id) as number
            const response = await this.motherboardService.getSingleMotherboards(validId) as Motherboard
            return res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
            return
        }
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        let productImage: string | undefined
        try {
            const dto: IMotherboard_Product = req.body
            const validatedDto = await bodyValidator(validateMotherboardAndProductDto, dto)
            const newMotherboard = fromRequestToMotherboard(validatedDto)
            const newProduct = fromRequestToProduct(validatedDto)
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
        try {
            const { id } = req.params
            if (!id) {
                throw MotherboardError.notFound()
            }
            await this.motherboardService.deleteMotherboard(Number(id))
            return res.status(StatusCodes.NO_CONTENT).send({ message: "Motherboard deleted successfully" })
        } catch (err) {
            next(err)
        }
    }
}