import { ManagedUpload } from "aws-sdk/clients/s3";
import { Application, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { inject } from "inversify";
import { Multer } from "multer";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractController } from "../../../abstractClasses/abstractController";
import { bodyValidator, mapperMessageError } from "../../../common/helpers/bodyValidator";
import { ImageUploadService } from "../../../imageUploader/module";
import { Product } from "../../../product/entity/Product";
import { Motherboard } from "../entity/Motherboard";
import { validateMotherboardAndProductDto, validateMotherboardEditDto, validateQueryCpuBrand } from "../helpers/dto-validator";
import { IMotherboard_Product } from "../interface/IMotherboardCreate";
import { MotherboardService } from "../service/motherboardService";
import { IMotherboardEdit } from '../interface/IMotherboardEdit'
import { jwtAuthentication } from "../../../auth/util/passportMiddlewares";
import { authorizationMiddleware } from "../../../authorization/util/authorizationMiddleware";
import { fromRequestToProduct } from "../../../product/mapper/productMapper";

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
        app.post(`/api${ROUTE}`, [jwtAuthentication, authorizationMiddleware({ action: 'create', subject: 'Motherboard' })], this.uploadMiddleware.single("product_image"), this.create.bind(this))
        app.put(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'update', subject: 'Motherboard' })], this.uploadMiddleware.none(), this.edit.bind(this))
        app.delete(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'delete', subject: 'Motherboard' })], this.delete.bind(this))
    }

    getAll = async (req: Request, res: Response): Promise<Response> => {
        const { cpu_brand } = req.query
        try {
            if (cpu_brand) {
                const valid_cpu_brand = validateQueryCpuBrand(cpu_brand.toString())
                const motherboardWithQuery = await this.motherboardService.getMotherboards(valid_cpu_brand)
                return res.status(StatusCodes.OK).send(motherboardWithQuery)
            }
            const response = await this.motherboardService.getMotherboards()
            return res.status(200).send(response)
        } catch (err) {
            return res.status(StatusCodes.NOT_FOUND).send({ error: err.message })
        }
    }

    create = async (req: Request, res: Response): Promise<Response> => {
        let upload: ManagedUpload.SendData | undefined
        try {
            const dto: IMotherboard_Product = req.body
            await bodyValidator(validateMotherboardAndProductDto, dto)
            const newMotherboard = new Motherboard(dto)
            const newProduct = fromRequestToProduct(dto)
            if (req.file) {
                const { buffer, originalname } = req.file
                upload = await this.uploadService.uploadProduct(buffer, originalname)
                newProduct.image = upload.Location
            } else {
                newProduct.image = null
            }
            const response = await this.motherboardService.createMotherboard(newProduct, newMotherboard)
            return res.status(200).send(response)
        } catch (err) {
            if (err.isJoi) {
                const joiErrors = mapperMessageError(err)
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).send(joiErrors)
            }
            if (req.file && upload) {
                this.uploadService.deleteProduct(upload.Location)
            }
            return res.status(200).send(err)
        }
    }

    edit = async (req: Request, res: Response): Promise<Response> => {
        let motherboard: Motherboard | undefined
        try {
            const dto: IMotherboardEdit = req.body
            const validatedDto = await bodyValidator(validateMotherboardEditDto, dto)
            motherboard = await this.motherboardService.modifyMotherboard(validatedDto) as Motherboard
            return res.status(StatusCodes.OK).send(motherboard)
        } catch (err) {
            if (err.isJoi === true) {
                const errorArray = mapperMessageError(err)
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({
                    errors: errorArray
                })
            }
            return res.status(StatusCodes.BAD_REQUEST).send({ message: err.message })
        }
    }

    delete = async (req: Request, res: Response): Promise<Response | Error> => {
        try {
            const { id } = req.params
            if (!id) {
                throw new Error('id not defined')
            }
            await this.motherboardService.deleteMotherboard(Number(id))
            return res.status(StatusCodes.OK).send({ message: "Motherboard deleted successfully" })
        } catch (err) {
            return res.status(StatusCodes.BAD_REQUEST).send({ message: err.message })
        }
    }
}