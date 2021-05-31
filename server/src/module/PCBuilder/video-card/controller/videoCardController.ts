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
import { VideoCard } from "../entities/VideoCard";
import { validateVideoCardAndProductDto, validateVideoCardEditDto, validateVideoCardQuerySchema } from "../helpers/dto-validator";
import { IVideoCard_Product } from "../interface/IVideoCardCreate";
import { IVideoCardQuery } from "../interface/IVideoCardQuery";
import { IVideoCardEdit } from '../interface/IVideoCardEdit'
import { VideoCardService } from "../service/VideoCardService";
import { FullVideoCard } from "../entities/FullVideoCard";
import { idNumberOrError } from "../../../common/helpers/idNumberOrError";
import { jwtAuthentication } from "../../../auth/util/passportMiddlewares";
import { authorizationMiddleware } from "../../../authorization/util/authorizationMiddleware";
import { fromRequestToProduct } from "../../../product/mapper/productMapper";

export class VideoCardController extends AbstractController {
    private ROUTE_BASE: string
    private videoCardService: VideoCardService;
    private uploadMiddleware: Multer
    private uploadService: ImageUploadService
    constructor(
        @inject(TYPES.PCBuilder.VideoCard.Service) videoCardService: VideoCardService,
        @inject(TYPES.Common.UploadMiddleware) uploadMiddleware: Multer,
        @inject(TYPES.ImageUploader.Service) uploadService: ImageUploadService
    ) {
        super()
        this.ROUTE_BASE = "/video-card"
        this.videoCardService = videoCardService
        this.uploadMiddleware = uploadMiddleware
        this.uploadService = uploadService
    }
    configureRoutes(app: Application): void {
        const ROUTE = this.ROUTE_BASE
        app.get(`/api${ROUTE}`, this.getAll.bind(this))
        app.get(`/api${ROUTE}/:id`, this.getSingleRam.bind(this))
        app.post(`/api${ROUTE}`, [jwtAuthentication, authorizationMiddleware({ action: 'create', subject: 'VideoCard' })], this.uploadMiddleware.single("product_image"), this.create.bind(this))
        app.put(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'update', subject: 'VideoCard' })], this.uploadMiddleware.none(), this.edit.bind(this))
        app.delete(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'delete', subject: 'VideoCard' })], this.delete.bind(this))
    }

    getAll = async (req: Request, res: Response): Promise<Response> => {
        try {
            const queryDto = req.query
            const hasQuery = Object.keys(queryDto).length
            if (hasQuery) {
                const validQueryDto = await bodyValidator(validateVideoCardQuerySchema, queryDto as IVideoCardQuery)
                const ramWithQuery = await this.videoCardService.getRams(validQueryDto)
                return res.status(StatusCodes.OK).send(ramWithQuery)
            }
            const response = await this.videoCardService.getRams()
            return res.status(200).send(response)
        } catch (err) {
            return res.status(StatusCodes.NOT_FOUND).send({ error: err.message })
        }
    }

    getSingleRam = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params
            const validId = idNumberOrError(id) as number
            const response = await this.videoCardService.getSingleRam(validId) as FullVideoCard
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
            const dto: IVideoCard_Product = req.body
            await bodyValidator(validateVideoCardAndProductDto, dto)
            const newMotherboard = new VideoCard(dto)
            const newProduct = fromRequestToProduct(dto)
            if (req.file) {
                const { buffer, originalname } = req.file
                upload = await this.uploadService.uploadProduct(buffer, originalname)
                newProduct.image = upload.Location
            } else {
                newProduct.image = null
            }

            const response = await this.videoCardService.createRam(newProduct, newMotherboard)
            return res.status(200).send(response)
        } catch (err) {
            console.log(err.message)
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
        let ram: VideoCard | undefined
        try {
            const { id } = req.params
            const validId = idNumberOrError(id) as number
            const dto: IVideoCardEdit = req.body
            const validatedDto = await bodyValidator(validateVideoCardEditDto, dto)
            ram = await this.videoCardService.modifyRam(validId, validatedDto) as VideoCard
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
            await this.videoCardService.deleteRam(validId)
            return res.status(StatusCodes.OK).send({ message: "Processor successfully deleted" })
        } catch (err) {
            if (err.isJoi) {
                return res.status(StatusCodes.BAD_REQUEST).send({ error: err.message })
            }
            return res.status(StatusCodes.BAD_REQUEST).send({ error: err.message })
        }
    }
}