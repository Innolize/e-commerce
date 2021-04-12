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
import { Cabinet } from "../entities/Cabinet";
import { validateCabinetAndProductDto, validateCabinetEditDto, validateCabinetQuerySchema } from "../helpers/dto-validator";
import { ICabinet_Product } from "../interface/ICabinetCreate";
import { ICabinetQuery } from "../interface/ICabinetQuery";
import { ICabinetEdit } from '../interface/ICabinetEdit'
import { CabinetService } from "../service/CabinetService";
import { FullCabinet } from "../entities/FullCabinet";
import { idNumberOrError } from "../../../common/helpers/idNumberOrError";

export class CabinetController extends AbstractController {
    private ROUTE_BASE: string
    private cabinetService: CabinetService;
    private uploadMiddleware: Multer
    private uploadService: ImageUploadService
    constructor(
        @inject(TYPES.PCBuilder.Cabinet.Service) cabinetService: CabinetService,
        @inject(TYPES.Common.UploadMiddleware) uploadMiddleware: Multer,
        @inject(TYPES.ImageUploader.Service) uploadService: ImageUploadService
    ) {
        super()
        this.ROUTE_BASE = "/cabinet"
        this.cabinetService = cabinetService
        this.uploadMiddleware = uploadMiddleware
        this.uploadService = uploadService
    }
    configureRoutes(app: Application): void {
        const ROUTE = this.ROUTE_BASE
        app.get(`/api${ROUTE}`, this.getAll.bind(this))
        app.get(`/api${ROUTE}/:id`, this.getSingleCabinet.bind(this))
        app.post(`/api${ROUTE}`, this.uploadMiddleware.single("product_image"), this.create.bind(this))
        app.put(`/api${ROUTE}/:id`, this.uploadMiddleware.none(), this.edit.bind(this))
        app.delete(`/api${ROUTE}/:id`, this.delete.bind(this))
    }

    getAll = async (req: Request, res: Response): Promise<Response> => {
        try {
            const queryDto = req.query
            const hasQuery = Object.keys(queryDto).length
            if (hasQuery) {
                const validQueryDto = await bodyValidator(validateCabinetQuerySchema, queryDto as ICabinetQuery)
                const ramWithQuery = await this.cabinetService.getCabinets(validQueryDto)
                return res.status(StatusCodes.OK).send(ramWithQuery)
            }
            const response = await this.cabinetService.getCabinets()
            return res.status(200).send(response)
        } catch (err) {
            return res.status(StatusCodes.NOT_FOUND).send({ error: err.message })
        }
    }

    getSingleCabinet = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params
            const validId = idNumberOrError(id) as number
            const response = await this.cabinetService.getSingleCabinet(validId) as FullCabinet
            return res.status(StatusCodes.OK).send(response)
        } catch (err) {
            if (err.isJoi) {
                return res.status(StatusCodes.BAD_REQUEST).send({ error: err.message })
            }
            return res.status(StatusCodes.NOT_FOUND).send({ error: err.message })
        }
    }

    create = async (req: Request, res: Response): Promise<Response> => {
        let upload: ManagedUpload.SendData | undefined
        try {
            const dto: ICabinet_Product = req.body
            await bodyValidator(validateCabinetAndProductDto, dto)
            const newCabinet = new Cabinet(dto)
            const newProduct = new Product(dto)
            if (req.file) {
                const { buffer, originalname } = req.file
                upload = await this.uploadService.uploadProduct(buffer, originalname)
                newProduct.image = upload.Location
            } else {
                newProduct.image = null
            }
            const response = await this.cabinetService.createCabinet(newProduct, newCabinet)
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
        let ram: Cabinet | undefined
        try {
            const { id } = req.params
            const validId = idNumberOrError(id) as number
            const dto: ICabinetEdit = req.body
            const validatedDto = await bodyValidator(validateCabinetEditDto, dto)
            ram = await this.cabinetService.modifyCabinet(validId, validatedDto) as Cabinet
            return res.status(StatusCodes.OK).send(ram)
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
            const validId = idNumberOrError(id) as number
            await this.cabinetService.deleteCabinet(validId)
            return res.status(StatusCodes.OK).send({ message: "Cabinet successfully deleted" })
        } catch (err) {
            if (err.isJoi) {
                return res.status(StatusCodes.BAD_REQUEST).send({ error: err.message })
            }
            return res.status(StatusCodes.BAD_REQUEST).send({ error: err.message })
        }
    }
}