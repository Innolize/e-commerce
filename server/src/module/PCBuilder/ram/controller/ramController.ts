import { Application, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { inject } from "inversify";
import { Multer } from "multer";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractController } from "../../../abstractClasses/abstractController";
import { bodyValidator } from "../../../common/helpers/bodyValidator";
import { Ram } from "../entities/Ram";
import { validateRamAndProductDto, validateRamEditDto, validateRamQuerySchema } from "../helpers/dto-validator";
import { IRam_Product_Form } from "../interface/IRamCreate";
import { IRamEdit } from '../interface/IRamEdit'
import { numberParamOrError } from "../../../common/helpers/numberParamOrError";
import { jwtAuthentication } from "../../../auth/util/passportMiddlewares";
import { authorizationMiddleware } from "../../../authorization/util/authorizationMiddleware";
import { fromRequestToProduct } from "../../../product/mapper/productMapper";
import { fromRequestToRamCreate } from "../mapper/ramMapper";
import { GetRamReqDto } from "../dto/getRamReqDto"
import { IRamGetAllQuery } from "../interface/IRamGetAllQuery";
import { BaseError } from "../../../common/error/BaseError";
import { IImageUploadService } from "../../../imageUploader/interfaces/IImageUploadService";
import { IProductService } from "../../../product/interfaces/IProductService";
import { IRamService } from "../interface/IRamService";

export class RamController extends AbstractController {
    private ROUTE_BASE: string
    private ramService: IRamService;
    private uploadMiddleware: Multer
    private uploadService: IImageUploadService
    private productService: IProductService

    constructor(
        @inject(TYPES.PCBuilder.Ram.Service) ramService: IRamService,
        @inject(TYPES.Common.UploadMiddleware) uploadMiddleware: Multer,
        @inject(TYPES.ImageUploader.Service) uploadService: IImageUploadService,
        @inject(TYPES.Product.Service) productService: IProductService

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
        app.get(`/api${ROUTE}/:id`, this.getSingle.bind(this))
        app.post(`/api${ROUTE}`, [jwtAuthentication, authorizationMiddleware({ action: 'create', subject: 'Ram' })], this.uploadMiddleware.single("product_image"), this.create.bind(this))
        app.put(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'update', subject: 'Ram' })], this.uploadMiddleware.none(), this.edit.bind(this))
        app.delete(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'delete', subject: 'Ram' })], this.delete.bind(this))
    }

    getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const dto: IRamGetAllQuery = req.query
            const { limit, offset, max_frec, min_frec, ram_version } = await bodyValidator(validateRamQuerySchema, dto)
            const queryParams = new GetRamReqDto(limit, offset, ram_version, min_frec, max_frec)
            const response = await this.ramService.getAll(queryParams)
            res.status(200).send(response)
        } catch (err) {
            next(err)
        }
    }

    getSingle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params
            const validId = numberParamOrError(id)
            const response = await this.ramService.getSingle(validId)
            res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
        }
    }

    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const RAM_CATEGORY = 6
        let productImage: string | undefined
        try {
            const dto: IRam_Product_Form = req.body
            const validatedDto = await bodyValidator(validateRamAndProductDto, dto)
            const newProduct = fromRequestToProduct({ ...validatedDto, id_category: RAM_CATEGORY })
            await this.productService.verifyCategoryAndBrandExistence(newProduct.id_category, newProduct.id_brand)
            if (req.file) {
                const upload = await this.uploadService.uploadProduct(req.file)
                newProduct.image = upload.Location
                productImage = upload.Location
            } else {
                newProduct.image = null
            }
            const newRam = fromRequestToRamCreate({ ...validatedDto, product: newProduct })
            const response = await this.ramService.create(newRam)
            res.status(StatusCodes.CREATED).send(response)
        } catch (err) {
            if (productImage) {
                this.uploadService.deleteProduct(productImage)
            }
            next(err)
        }
    }

    edit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        let ram: Ram | undefined
        try {
            const { id } = req.params
            const validId = numberParamOrError(id)
            const dto: IRamEdit = req.body
            const validatedDto = await bodyValidator(validateRamEditDto, dto)
            BaseError.validateNonEmptyForm(validatedDto)
            ram = await this.ramService.modify(validId, validatedDto)
            res.status(StatusCodes.OK).send(ram)
        } catch (err) {
            next(err)
        }
    }

    delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params
            const validId = numberParamOrError(id)
            await this.ramService.delete(validId)
            res.status(StatusCodes.NO_CONTENT).send({ message: "Processor successfully deleted" })
        } catch (err) {
            next(err)
        }
    }
}