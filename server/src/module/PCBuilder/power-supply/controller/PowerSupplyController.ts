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
import { PowerSupply } from "../entities/PowerSupply";
import { validatePowerSupplyAndProductDto, validatePowerSupplyEditDto, validatePowerSupplyQuerySchema } from "../helpers/dto-validator";
import { IPowerSupply_Product } from "../interface/IPowerSupplyCreate";
import { IPowerSupplyQuery } from "../interface/IPowerSupplyQuery";
import { IPowerSupplyEdit } from '../interface/IPowerSupplyEdit'
import { PowerSupplyService } from "../service/PowerSupplyService";
import { FullPowerSupply } from "../entities/FullPowerSupply";
import { idNumberOrError } from "../../../common/helpers/idNumberOrError";
import { jwtAuthentication } from "../../../auth/util/passportMiddlewares";
import { authorizationMiddleware } from "../../../authorization/util/authorizationMiddleware";
import { fromRequestToProduct } from "../../../product/mapper/productMapper";

export class PowerSupplyController extends AbstractController {
    private ROUTE_BASE: string
    private powerSupplyService: PowerSupplyService;
    private uploadMiddleware: Multer
    private uploadService: ImageUploadService
    constructor(
        @inject(TYPES.PCBuilder.PowerSupply.Service) powerSupplyService: PowerSupplyService,
        @inject(TYPES.Common.UploadMiddleware) uploadMiddleware: Multer,
        @inject(TYPES.ImageUploader.Service) uploadService: ImageUploadService
    ) {
        super()
        this.ROUTE_BASE = "/power-supply"
        this.powerSupplyService = powerSupplyService
        this.uploadMiddleware = uploadMiddleware
        this.uploadService = uploadService
    }
    configureRoutes(app: Application): void {
        const ROUTE = this.ROUTE_BASE
        app.get(`/api${ROUTE}`, this.getAll.bind(this))
        app.get(`/api${ROUTE}/:id`, this.getSinglePowerSupply.bind(this))
        app.post(`/api${ROUTE}`, [jwtAuthentication, authorizationMiddleware({ action: 'create', subject: 'PowerSupply' })],this.uploadMiddleware.single("product_image"), this.create.bind(this))
        app.put(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'update', subject: 'PowerSupply' })],this.uploadMiddleware.none(), this.edit.bind(this))
        app.delete(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'delete', subject: 'PowerSupply' })],this.delete.bind(this))
    }

    getAll = async (req: Request, res: Response): Promise<Response> => {
        try {
            const queryDto = req.query
            const hasQuery = Object.keys(queryDto).length
            if (hasQuery) {
                const validQueryDto = await bodyValidator(validatePowerSupplyQuerySchema, queryDto as IPowerSupplyQuery)
                const powerSuppliesWithQuery = await this.powerSupplyService.getPowerSupply(validQueryDto)
                return res.status(StatusCodes.OK).send(powerSuppliesWithQuery)
            }
            const response = await this.powerSupplyService.getPowerSupply()
            return res.status(200).send(response)
        } catch (err) {
            return res.status(StatusCodes.NOT_FOUND).send({ error: err.message })
        }
    }

    getSinglePowerSupply = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params
            const validId = idNumberOrError(id) as number
            const response = await this.powerSupplyService.getSinglePowerSupply(validId) as FullPowerSupply
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
            const dto: IPowerSupply_Product = req.body
            await bodyValidator(validatePowerSupplyAndProductDto, dto)
            const newPowerSupply = new PowerSupply(dto)
            const newProduct = fromRequestToProduct(dto)
            if (req.file) {
                const { buffer, originalname } = req.file
                upload = await this.uploadService.uploadProduct(buffer, originalname)
                newProduct.image = upload.Location
            } else {
                newProduct.image = null
            }
            const response = await this.powerSupplyService.createPowerSupply(newProduct, newPowerSupply)
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
        let powerSupply: PowerSupply | undefined
        try {
            const { id } = req.params
            const validId = idNumberOrError(id) as number
            const dto: IPowerSupplyEdit = req.body
            const validatedDto = await bodyValidator(validatePowerSupplyEditDto, dto)
            powerSupply = await this.powerSupplyService.modifyPowerSupply(validId, validatedDto) as PowerSupply
            return res.status(StatusCodes.OK).send(powerSupply)
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
            await this.powerSupplyService.deletePowerSupply(validId)
            return res.status(StatusCodes.OK).send({ message: "Power supply successfully deleted" })
        } catch (err) {
            if (err.isJoi) {
                return res.status(StatusCodes.BAD_REQUEST).send({ error: err.message })
            }
            return res.status(StatusCodes.BAD_REQUEST).send({ error: err.message })
        }
    }
}