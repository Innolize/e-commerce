import { Application, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { inject } from "inversify";
import { Multer } from "multer";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractController } from "../../../abstractClasses/abstractController";
import { bodyValidator } from "../../../common/helpers/bodyValidator";
import { VideoCard } from "../entities/VideoCard";
import { validateVideoCardAndProductDto, validateVideoCardEditDto, validateVideoCardQuerySchema } from "../helpers/dto-validator";
import { IVideoCard_Product_Form } from "../interface/IVideoCardCreate";
import { IVideoCardGetAllQuery } from "../interface/IVideoCardGetAllQuery";
import { IVideoCardEdit } from '../interface/IVideoCardEdit'
import { numberParamOrError } from "../../../common/helpers/numberParamOrError";
import { jwtAuthentication } from "../../../auth/util/passportMiddlewares";
import { authorizationMiddleware } from "../../../authorization/util/authorizationMiddleware";
import { fromRequestToProduct } from "../../../product/mapper/productMapper";
import { fromRequestToVideoCardCreate } from "../mapper/videoCardMapper";
import { GetVideoCardReqDto } from "../dto/getVideoCardReqDto";
import { BaseError } from "../../../common/error/BaseError";
import { IVideoCardService } from "../interface/IVideoCardService";
import { IImageUploadService } from "../../../imageUploader/interfaces/IImageUploadService";
import { IProductService } from "../../../product/interfaces/IProductService";

export class VideoCardController extends AbstractController {
    private ROUTE_BASE: string
    private videoCardService: IVideoCardService;
    private uploadMiddleware: Multer
    private uploadService: IImageUploadService
    private productService: IProductService

    constructor(
        @inject(TYPES.PCBuilder.VideoCard.Service) videoCardService: IVideoCardService,
        @inject(TYPES.Common.UploadMiddleware) uploadMiddleware: Multer,
        @inject(TYPES.ImageUploader.Service) uploadService: IImageUploadService,
        @inject(TYPES.Product.Service) productService: IProductService
    ) {
        super()
        this.ROUTE_BASE = "/video-card"
        this.videoCardService = videoCardService
        this.uploadMiddleware = uploadMiddleware
        this.uploadService = uploadService
        this.productService = productService
    }
    configureRoutes(app: Application): void {
        const ROUTE = this.ROUTE_BASE
        app.get(`/api${ROUTE}`, this.getAll.bind(this))
        app.get(`/api${ROUTE}/:id`, this.getSingle.bind(this))
        app.post(`/api${ROUTE}`, [jwtAuthentication, authorizationMiddleware({ action: 'create', subject: 'VideoCard' })], this.uploadMiddleware.single("product_image"), this.create.bind(this))
        app.put(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'update', subject: 'VideoCard' })], this.uploadMiddleware.none(), this.edit.bind(this))
        app.delete(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'delete', subject: 'VideoCard' })], this.delete.bind(this))
    }

    getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const dto: IVideoCardGetAllQuery = req.query
            const { limit, version, offset } = await bodyValidator(validateVideoCardQuerySchema, dto)
            const queryParams = new GetVideoCardReqDto(limit, offset, version)
            const response = await this.videoCardService.getAll(queryParams)
            res.status(200).send(response)
        } catch (err) {
            next(err)
        }
    }

    getSingle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params
            const validId = numberParamOrError(id)
            const response = await this.videoCardService.getSingle(validId)
            res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
        }
    }

    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const VIDEO_CARD_CATEGORY = 7
        let productImage: string | undefined
        try {
            const dto: IVideoCard_Product_Form = req.body
            const validatedDto = await bodyValidator(validateVideoCardAndProductDto, dto)
            const newProduct = fromRequestToProduct({ ...validatedDto, id_category: VIDEO_CARD_CATEGORY })
            await this.productService.verifyCategoryAndBrandExistence(newProduct.id_category, newProduct.id_brand)
            if (req.file) {
                const upload = await this.uploadService.uploadProduct(req.file)
                newProduct.image = upload.Location
                productImage = upload.Location
            } else {
                newProduct.image = null
            }
            const newRam = fromRequestToVideoCardCreate({ ...validatedDto, product: newProduct })
            const response = await this.videoCardService.create(newRam)
            res.status(StatusCodes.CREATED).send(response)
        } catch (err) {
            if (productImage) {
                this.uploadService.deleteProduct(productImage)
            }
            next(err)
        }
    }

    edit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        let ram: VideoCard | undefined
        try {
            const { id } = req.params
            const validId = numberParamOrError(id)
            const dto: IVideoCardEdit = req.body
            const validatedDto = await bodyValidator(validateVideoCardEditDto, dto)
            BaseError.validateNonEmptyForm(validatedDto)
            ram = await this.videoCardService.modify(validId, validatedDto)
            res.status(StatusCodes.OK).send(ram)
        } catch (err) {
            next(err)
        }
    }

    delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params
            const validId = numberParamOrError(id)
            await this.videoCardService.delete(validId)
            res.status(StatusCodes.NO_CONTENT).send({ message: "Video card successfully deleted" })
        } catch (err) {
            next(err)
        }
    }
}