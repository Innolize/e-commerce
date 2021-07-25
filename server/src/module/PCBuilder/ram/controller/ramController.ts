import { Application, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { inject } from "inversify";
import { Multer } from "multer";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractController } from "../../../abstractClasses/abstractController";
import { bodyValidator } from "../../../common/helpers/bodyValidator";
import { ImageUploadService } from "../../../imageUploader/module";
import { Ram } from "../entities/Ram";
import { validateRamAndProductDto, validateRamEditDto, validateRamQuerySchema } from "../helpers/dto-validator";
import { IRam_Product } from "../interface/IRamCreate";
import { IRamEdit } from '../interface/IRamEdit'
import { RamService } from "../service/ramService";
import { numberParamOrError } from "../../../common/helpers/numberParamOrError";
import { jwtAuthentication } from "../../../auth/util/passportMiddlewares";
import { authorizationMiddleware } from "../../../authorization/util/authorizationMiddleware";
import { fromRequestToProduct } from "../../../product/mapper/productMapper";
import { fromRequestToRam } from "../mapper/ramMapper";
import { ProductService } from "../../../product/module";
import { RamError } from "../error/RamError";
import { GetRamsReqDto } from "../dto/getRamsReqDto"
import { IRamGetAllQuery } from "../interface/IRamGetAllQuery";

export class RamController extends AbstractController {
    private ROUTE_BASE: string
    private ramService: RamService;
    private uploadMiddleware: Multer
    private uploadService: ImageUploadService
    private productService: ProductService

    constructor(
        @inject(TYPES.PCBuilder.Ram.Service) ramService: RamService,
        @inject(TYPES.Common.UploadMiddleware) uploadMiddleware: Multer,
        @inject(TYPES.ImageUploader.Service) uploadService: ImageUploadService,
        @inject(TYPES.Product.Service) productService: ProductService

    ) {
        super()
        this.ROUTE_BASE = "/ram"
        this.ramService = ramService
        this.uploadMiddleware = uploadMiddleware
        this.uploadService = uploadService
        this.productService = productService
    }
    configureRoutes(app: Application): void {
        const ROUTE = this.ROUTE_BASE
        app.get(`/api${ROUTE}`, this.getAll.bind(this))
        app.get(`/api${ROUTE}/:id`, this.getSingleRam.bind(this))
        app.post(`/api${ROUTE}`, [jwtAuthentication, authorizationMiddleware({ action: 'create', subject: 'Ram' })], this.uploadMiddleware.single("product_image"), this.create.bind(this))
        app.put(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'update', subject: 'Ram' })], this.uploadMiddleware.none(), this.edit.bind(this))
        app.delete(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'delete', subject: 'Ram' })], this.delete.bind(this))
    }

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto: IRamGetAllQuery = req.query
            const { limit, offset, max_frec, min_frec, ram_version } = await bodyValidator(validateRamQuerySchema, dto)
            const queryParams = new GetRamsReqDto(limit, offset, ram_version, min_frec, max_frec)
            const response = await this.ramService.getRams(queryParams)
            return res.status(200).send(response)
        } catch (err) {
            next(err)
        }
    }

    getSingleRam = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const params = req.params
            const validId = numberParamOrError(params, "id")
            const response = await this.ramService.getSingleRam(validId) as Ram
            return res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
        }
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        const RAM_CATEGORY = 6
        let productImage: string | undefined
        try {
            const dto: IRam_Product = req.body
            const validatedDto = await bodyValidator(validateRamAndProductDto, dto)
            const newMotherboard = fromRequestToRam(validatedDto)
            const newProduct = fromRequestToProduct({ ...validatedDto, id_category: RAM_CATEGORY })
            await this.productService.verifyCategoryAndBrandExistence(newProduct.id_category, newProduct.id_brand)
            if (req.file) {
                const { buffer, originalname } = req.file
                const upload = await this.uploadService.uploadProduct(buffer, originalname)
                newProduct.image = upload.Location
                productImage = upload.Location
            } else {
                newProduct.image = null
            }
            const response = await this.ramService.createRam(newProduct, newMotherboard)
            return res.status(StatusCodes.CREATED).send(response)
        } catch (err) {
            if (productImage) {
                this.uploadService.deleteProduct(productImage)
            }
            next(err)
        }
    }

    edit = async (req: Request, res: Response, next: NextFunction) => {
        let ram: Ram | undefined
        try {
            const params = req.params
            const validId = numberParamOrError(params, "id")
            const dto: IRamEdit = req.body
            const validatedDto = await bodyValidator(validateRamEditDto, dto)
            ram = await this.ramService.modifyRam(validId, validatedDto) as Ram
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
                throw RamError.invalidId()
            }
            await this.ramService.deleteRam(idNumber)
            return res.status(StatusCodes.NO_CONTENT).send({ message: "Processor successfully deleted" })
        } catch (err) {
            next(err)
        }
    }
}