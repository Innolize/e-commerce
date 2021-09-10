import { Application, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { inject } from "inversify";
import { Multer } from "multer";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractController } from "../../../abstractClasses/abstractController";
import { bodyValidator } from "../../../common/helpers/bodyValidator";
import { ImageUploadService } from "../../../imageUploader/module";
import { Cabinet } from "../entities/Cabinet";
import { validateCabinetAndProductDto, validateCabinetEditDto, validateCabinetQuerySchema } from "../helpers/dto-validator";
import { ICabinetGetCabinets } from "../interface/ICabinetGetCabinets";
import { ICabinetEdit } from '../interface/ICabinetEdit'
import { CabinetService } from "../service/CabinetService";
import { numberParamOrError } from "../../../common/helpers/numberParamOrError";
import { authorizationMiddleware } from "../../../authorization/util/authorizationMiddleware";
import { jwtAuthentication } from "../../../auth/util/passportMiddlewares";
import { fromRequestToProduct } from "../../../product/mapper/productMapper";
import { fromRequestToCabinetProductless } from "../mapper/cabinetMapper";
import { CabinetError } from "../error/CabinetError";
import { GetCabinetsReqDto } from "../dto/getCabinetsReqDto";
import { ICabinet_Create_Productless } from "../interface/ICabinetCreate";

export class CabinetController extends AbstractController {
    private ROUTE_BASE: string
    constructor(
        @inject(TYPES.PCBuilder.Cabinet.Service) private cabinetService: CabinetService,
        @inject(TYPES.Common.UploadMiddleware) private uploadMiddleware: Multer,
        @inject(TYPES.ImageUploader.Service) private uploadService: ImageUploadService,
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
        app.post(`/api${ROUTE}`, [jwtAuthentication, authorizationMiddleware({ action: 'create', subject: 'Cabinet' })], this.uploadMiddleware.single("product_image"), this.create.bind(this))
        app.put(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'update', subject: 'Cabinet' })], this.uploadMiddleware.none(), this.edit.bind(this))
        app.delete(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'delete', subject: 'Cabinet' })], this.delete.bind(this))
    }

    getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const dto: ICabinetGetCabinets = req.query
            const { limit, offset, size } = await bodyValidator(validateCabinetQuerySchema, dto)
            const queryParam = new GetCabinetsReqDto(limit, offset, size)
            const response = await this.cabinetService.getCabinets(queryParam)
            res.status(200).send(response)
        } catch (err) {
            next(err)
        }
    }

    getSingleCabinet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const params = req.params
            const validId = numberParamOrError(params, "id")
            const response = await this.cabinetService.getSingleCabinet(validId)
            res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
        }
    }

    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const CABINET_CATEGORY = 1
        let productImage: string | undefined
        try {
            const dto: ICabinet_Create_Productless = req.body
            const validatedDto = await bodyValidator(validateCabinetAndProductDto, dto)
            const newCabinet = fromRequestToCabinetProductless(validatedDto)
            const newProduct = fromRequestToProduct({ ...validatedDto, id_category: CABINET_CATEGORY })
            if (req.file) {
                const upload = await this.uploadService.uploadProduct(req.file)
                newProduct.image = upload.Location
                productImage = upload.Location
            } else {
                newProduct.image = null
            }
            const response = await this.cabinetService.createCabinet(newProduct, newCabinet)
            res.status(201).send(response)
        } catch (err) {
            if (productImage) {
                this.uploadService.deleteProduct(productImage)
            }
            next(err)
        }
    }

    edit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const params = req.params
            const validId = numberParamOrError(params, "id")
            const dto: ICabinetEdit = req.body
            const validatedDto = await bodyValidator(validateCabinetEditDto, dto)
            const cabinet = await this.cabinetService.modifyCabinet(validId, validatedDto) as Cabinet
            res.status(StatusCodes.OK).send(cabinet)
        } catch (err) {
            next(err)
        }
    }

    delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { id } = req.params
        try {
            const idNumber = Number(id)
            if (!idNumber || idNumber <= 0) {
                throw CabinetError.invalidId()
            }
            await this.cabinetService.deleteCabinet(idNumber)
            res.status(StatusCodes.OK).send({ message: "Cabinet successfully deleted" })
        } catch (err) {
            next(err)
        }
    }
}