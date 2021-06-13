import { Application, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { inject } from "inversify";
import { Multer } from "multer";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractController } from "../../../abstractClasses/abstractController";
import { bodyValidator } from "../../../common/helpers/bodyValidator";
import { ImageUploadService } from "../../../imageUploader/module";
import { VideoCard } from "../entities/VideoCard";
import { validateVideoCardAndProductDto, validateVideoCardEditDto, validateVideoCardQuerySchema } from "../helpers/dto-validator";
import { IVideoCard_Product } from "../interface/IVideoCardCreate";
import { IVideoCardGetAllQuery } from "../interface/IVideoCardGetAllQuery";
import { IVideoCardEdit } from '../interface/IVideoCardEdit'
import { VideoCardService } from "../service/VideoCardService";
import { idNumberOrError } from "../../../common/helpers/idNumberOrError";
import { jwtAuthentication } from "../../../auth/util/passportMiddlewares";
import { authorizationMiddleware } from "../../../authorization/util/authorizationMiddleware";
import { fromRequestToProduct } from "../../../product/mapper/productMapper";
import { fromRequestToVideoCard } from "../mapper/videoCardMapper";
import { ProductService } from "../../../product/module";
import { VideoCardError } from "../error/VideoCardError";
import { GetVideoCardsReqDto } from "../dto/getVideoCardsReqDto";

export class VideoCardController extends AbstractController {
    private ROUTE_BASE: string
    private videoCardService: VideoCardService;
    private uploadMiddleware: Multer
    private uploadService: ImageUploadService
    private productService: ProductService

    constructor(
        @inject(TYPES.PCBuilder.VideoCard.Service) videoCardService: VideoCardService,
        @inject(TYPES.Common.UploadMiddleware) uploadMiddleware: Multer,
        @inject(TYPES.ImageUploader.Service) uploadService: ImageUploadService,
        @inject(TYPES.Product.Service) productService: ProductService
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
        app.get(`/api${ROUTE}/:id`, this.getSingleRam.bind(this))
        app.post(`/api${ROUTE}`, [jwtAuthentication, authorizationMiddleware({ action: 'create', subject: 'VideoCard' })], this.uploadMiddleware.single("product_image"), this.create.bind(this))
        app.put(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'update', subject: 'VideoCard' })], this.uploadMiddleware.none(), this.edit.bind(this))
        app.delete(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'delete', subject: 'VideoCard' })], this.delete.bind(this))
    }

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto: IVideoCardGetAllQuery = req.query
            const { limit, version, offset } = await bodyValidator(validateVideoCardQuerySchema, dto)
            const queryParams = new GetVideoCardsReqDto(limit, offset, version)
            const response = await this.videoCardService.getVideoCard(queryParams)
            return res.status(200).send(response)
        } catch (err) {
            next(err)
        }
    }

    getSingleRam = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params
            const validId = idNumberOrError(id) as number
            const response = await this.videoCardService.getSingleVideoCard(validId) as VideoCard
            return res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
        }
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        const VIDEO_CARD_CATEGORY = 7
        let productImage: string | undefined
        try {
            const dto: IVideoCard_Product = req.body
            const validatedDto = await bodyValidator(validateVideoCardAndProductDto, dto)
            const newMotherboard = fromRequestToVideoCard(validatedDto)
            const newProduct = fromRequestToProduct({ ...validatedDto, id_category: VIDEO_CARD_CATEGORY })
            await this.productService.verifyCategoryAndBrandExistence(newProduct.id_category, newProduct.id_brand)
            if (req.file) {
                const { buffer, originalname } = req.file
                const upload = await this.uploadService.uploadProduct(buffer, originalname)
                newProduct.image = upload.Location
                productImage = upload.Location
            } else {
                newProduct.image = null
            }

            const response = await this.videoCardService.createVideoCard(newProduct, newMotherboard)
            return res.status(StatusCodes.CREATED).send(response)
        } catch (err) {
            if (productImage) {
                this.uploadService.deleteProduct(productImage)
            }
            next(err)
        }
    }

    edit = async (req: Request, res: Response, next: NextFunction) => {
        let ram: VideoCard | undefined
        try {
            const { id } = req.params
            const validId = idNumberOrError(id) as number
            const dto: IVideoCardEdit = req.body
            const validatedDto = await bodyValidator(validateVideoCardEditDto, dto)
            ram = await this.videoCardService.modifyVideoCard(validId, validatedDto) as VideoCard
            return res.status(StatusCodes.OK).send(ram)
        } catch (err) {
            next(err)
        }
    }

    delete = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params
        try {
            const idNumber = Number(id)
            if (!idNumber || idNumber <= 0) {
                throw VideoCardError.invalidId()
            }
            await this.videoCardService.deleteVideoCard(idNumber)
            return res.status(StatusCodes.NO_CONTENT).send({ message: "Video card successfully deleted" })
        } catch (err) {
            next(err)
        }
    }
}