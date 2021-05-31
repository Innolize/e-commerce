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
import { Ram } from "../entities/Ram";
import { validateRamAndProductDto, validateRamEditDto, validateRamQuerySchema } from "../helpers/dto-validator";
import { IRam_Product } from "../interface/IRamCreate";
import { IRamQuery } from "../interface/IRamQuery";
import { IRamEdit } from '../interface/IRamEdit'
import { RamService } from "../service/ramService";
import { FullRam } from "../entities/FullRam";
import { idNumberOrError } from "../../../common/helpers/idNumberOrError";
import { jwtAuthentication } from "../../../auth/util/passportMiddlewares";
import { authorizationMiddleware } from "../../../authorization/util/authorizationMiddleware";
import { fromRequestToProduct } from "../../../product/mapper/productMapper";

export class RamController extends AbstractController {
    private ROUTE_BASE: string
    private ramService: RamService;
    private uploadMiddleware: Multer
    private uploadService: ImageUploadService
    constructor(
        @inject(TYPES.PCBuilder.Ram.Service) ramService: RamService,
        @inject(TYPES.Common.UploadMiddleware) uploadMiddleware: Multer,
        @inject(TYPES.ImageUploader.Service) uploadService: ImageUploadService
    ) {
        super()
        this.ROUTE_BASE = "/ram"
        this.ramService = ramService
        this.uploadMiddleware = uploadMiddleware
        this.uploadService = uploadService
    }
    configureRoutes(app: Application): void {
        const ROUTE = this.ROUTE_BASE
        app.get(`/api${ROUTE}`, this.getAll.bind(this))
        app.get(`/api${ROUTE}/:id`, this.getSingleRam.bind(this))
        app.post(`/api${ROUTE}`, [jwtAuthentication, authorizationMiddleware({ action: 'create', subject: 'Ram' })], this.uploadMiddleware.single("product_image"), this.create.bind(this))
        app.put(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'update', subject: 'Ram' })], this.uploadMiddleware.none(), this.edit.bind(this))
        app.delete(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'delete', subject: 'Ram' })], this.delete.bind(this))
    }

    getAll = async (req: Request, res: Response): Promise<Response> => {
        try {
            const queryDto = req.query
            const hasQuery = Object.keys(queryDto).length
            if (hasQuery) {
                const validQueryDto = await bodyValidator(validateRamQuerySchema, queryDto as IRamQuery)
                const ramWithQuery = await this.ramService.getRams(validQueryDto)
                return res.status(StatusCodes.OK).send(ramWithQuery)
            }
            const response = await this.ramService.getRams()
            return res.status(200).send(response)
        } catch (err) {
            return res.status(StatusCodes.NOT_FOUND).send({ error: err.message })
        }
    }

    getSingleRam = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params
            const validId = idNumberOrError(id) as number
            const response = await this.ramService.getSingleRam(validId) as FullRam
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
            const dto: IRam_Product = req.body
            await bodyValidator(validateRamAndProductDto, dto)
            const newMotherboard = new Ram(dto)
            const newProduct = fromRequestToProduct(dto)
            if (req.file) {
                const { buffer, originalname } = req.file
                upload = await this.uploadService.uploadProduct(buffer, originalname)
                newProduct.image = upload.Location
            } else {
                newProduct.image = null
            }
            const response = await this.ramService.createRam(newProduct, newMotherboard)
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
        let ram: Ram | undefined
        try {
            const { id } = req.params
            const validId = idNumberOrError(id) as number
            const dto: IRamEdit = req.body
            const validatedDto = await bodyValidator(validateRamEditDto, dto)
            ram = await this.ramService.modifyRam(validId, validatedDto) as Ram
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
            await this.ramService.deleteRam(validId)
            return res.status(StatusCodes.OK).send({ message: "Processor successfully deleted" })
        } catch (err) {
            if (err.isJoi) {
                return res.status(StatusCodes.BAD_REQUEST).send({ error: err.message })
            }
            return res.status(StatusCodes.BAD_REQUEST).send({ error: err.message })
        }
    }
}