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
import { ICabinet_Product } from "../interface/ICabinetCreate";
import { ICabinetGetCabinets } from "../interface/ICabinetGetCabinets";
import { ICabinetEdit } from '../interface/ICabinetEdit'
import { CabinetService } from "../service/CabinetService";
import { idNumberOrError } from "../../../common/helpers/idNumberOrError";
import { authorizationMiddleware } from "../../../authorization/util/authorizationMiddleware";
import { jwtAuthentication } from "../../../auth/util/passportMiddlewares";
import { fromRequestToProduct } from "../../../product/mapper/productMapper";
import { fromRequestToCabinet } from "../mapper/cabinetMapper";
import { ProductService } from "../../../product/module";
import { CabinetError } from "../error/CabinetError";
import { GetCabinetsReqDto } from "../dto/getCabinetsReqDto";

export class CabinetController extends AbstractController {
    private ROUTE_BASE: string
    private cabinetService: CabinetService;
    private uploadMiddleware: Multer
    private uploadService: ImageUploadService
    private productService: ProductService
    constructor(
        @inject(TYPES.PCBuilder.Cabinet.Service) cabinetService: CabinetService,
        @inject(TYPES.Common.UploadMiddleware) uploadMiddleware: Multer,
        @inject(TYPES.ImageUploader.Service) uploadService: ImageUploadService,
        @inject(TYPES.Product.Service) productService: ProductService
    ) {
        super()
        this.ROUTE_BASE = "/cabinet"
        this.cabinetService = cabinetService
        this.uploadMiddleware = uploadMiddleware
        this.uploadService = uploadService
        this.productService = productService
    }
    configureRoutes(app: Application): void {
        const ROUTE = this.ROUTE_BASE
        app.get(`/api${ROUTE}`, this.getAll.bind(this))
        app.get(`/api${ROUTE}/:id`, this.getSingleCabinet.bind(this))
        app.post(`/api${ROUTE}`, [jwtAuthentication, authorizationMiddleware({ action: 'create', subject: 'Cabinet' })], this.uploadMiddleware.single("product_image"), this.create.bind(this))
        app.put(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'update', subject: 'Cabinet' })], this.uploadMiddleware.none(), this.edit.bind(this))
        app.delete(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'delete', subject: 'Cabinet' })], this.delete.bind(this))
    }

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto: ICabinetGetCabinets = req.query
            const { limit, offset, size } = await bodyValidator(validateCabinetQuerySchema, dto)
            const queryParam = new GetCabinetsReqDto(limit, offset, size)
            const response = await this.cabinetService.getCabinets(queryParam)
            return res.status(200).send(response)
        } catch (err) {
            next(err)
        }
    }

    getSingleCabinet = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params
            const validId = idNumberOrError(id) as number
            const response = await this.cabinetService.getSingleCabinet(validId) as Cabinet
            return res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
        }
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        const CABINET_CATEGORY = 1
        let productImage: string | undefined
        try {
            const dto: ICabinet_Product = req.body
            const validatedDto = await bodyValidator(validateCabinetAndProductDto, dto)
            const newCabinet = fromRequestToCabinet(validatedDto)
            const newProduct = fromRequestToProduct({ ...validatedDto, id_brand: CABINET_CATEGORY })
            await this.productService.verifyCategoryAndBrandExistence(newProduct.id_category, newProduct.id_brand)
            if (req.file) {
                const { buffer, originalname } = req.file
                const upload = await this.uploadService.uploadProduct(buffer, originalname)
                newProduct.image = upload.Location
                productImage = upload.Location
            } else {
                newProduct.image = null
            }
            const response = await this.cabinetService.createCabinet(newProduct, newCabinet)
            return res.status(200).send(response)
        } catch (err) {
            if (productImage) {
                this.uploadService.deleteProduct(productImage)
            }
            next(err)
        }
    }

    edit = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params
            const validId = idNumberOrError(id) as number
            const dto: ICabinetEdit = req.body
            const validatedDto = await bodyValidator(validateCabinetEditDto, dto)
            const cabinet = await this.cabinetService.modifyCabinet(validId, validatedDto) as Cabinet
            return res.status(StatusCodes.OK).send(cabinet)
        } catch (err) {
            next(err)
        }
    }

    delete = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params
        try {
            const idNumber = Number(id)
            if (!idNumber || idNumber <= 0) {
                throw CabinetError.invalidId()
            }
            await this.cabinetService.deleteCabinet(idNumber)
            return res.status(StatusCodes.OK).send({ message: "Cabinet successfully deleted" })
        } catch (err) {
            next(err)
        }
    }
}