import { Application, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { inject } from "inversify";
import { Multer } from "multer";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractController } from "../../../abstractClasses/abstractController";
import { bodyValidator } from "../../../common/helpers/bodyValidator";
import { PowerSupply } from "../entities/PowerSupply";
import { validatePowerSupplyAndProductDto, validatePowerSupplyEditDto, validatePowerSupplyQuerySchema } from "../helpers/dto-validator";
import { IPowerSupply_Product_Form } from "../interface/IPowerSupplyCreate";
import { IPowerSupplyGetAllQuery } from "../interface/IPowerSupplyGetAllQuery";
import { IPowerSupplyEdit } from '../interface/IPowerSupplyEdit'
import { numberParamOrError } from "../../../common/helpers/numberParamOrError";
import { jwtAuthentication } from "../../../auth/util/passportMiddlewares";
import { authorizationMiddleware } from "../../../authorization/util/authorizationMiddleware";
import { fromRequestToProduct } from "../../../product/mapper/productMapper";
import { fromRequestToPowerSupplyCreate } from "../mapper/powerSupplyMapper";
import { GetPowerSupplyReqDto } from "../dto/getPowerSupplyReqDto";
import { IImageUploadService } from "../../../imageUploader/interfaces/IImageUploadService";
import { IProductService } from "../../../product/interfaces/IProductService";
import { IPowerSupplyService } from "../interface/IPowerSupplyService";
import { BaseError } from "../../../common/error/BaseError";

export class PowerSupplyController extends AbstractController {
    private ROUTE_BASE: string
    private powerSupplyService: IPowerSupplyService;
    private uploadMiddleware: Multer
    private uploadService: IImageUploadService
    private productService: IProductService
    constructor(
        @inject(TYPES.PCBuilder.PowerSupply.Service) powerSupplyService: IPowerSupplyService,
        @inject(TYPES.Common.UploadMiddleware) uploadMiddleware: Multer,
        @inject(TYPES.ImageUploader.Service) uploadService: IImageUploadService,
        @inject(TYPES.Product.Service) productService: IProductService
    ) {
        super()
        this.ROUTE_BASE = "/power-supply"
        this.powerSupplyService = powerSupplyService
        this.uploadMiddleware = uploadMiddleware
        this.uploadService = uploadService
        this.productService = productService
    }
    configureRoutes(app: Application): void {
        const ROUTE = this.ROUTE_BASE
        app.get(`/api${ROUTE}`, this.getAll.bind(this))
        app.get(`/api${ROUTE}/:id`, this.getSingle.bind(this))
        app.post(`/api${ROUTE}`, [jwtAuthentication, authorizationMiddleware({ action: 'create', subject: 'PowerSupply' })], this.uploadMiddleware.single("product_image"), this.create.bind(this))
        app.put(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'update', subject: 'PowerSupply' })], this.uploadMiddleware.none(), this.edit.bind(this))
        app.delete(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'delete', subject: 'PowerSupply' })], this.delete.bind(this))
    }

    getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const dto: IPowerSupplyGetAllQuery = req.query
            const { limit, offset, watts } = await bodyValidator(validatePowerSupplyQuerySchema, dto)
            const queryParams = new GetPowerSupplyReqDto(limit, offset, watts)
            const response = await this.powerSupplyService.getAll(queryParams)
            res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
        }
    }

    getSingle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params
            const validId = numberParamOrError(id)
            const response = await this.powerSupplyService.getSingle(validId)
            res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
        }
    }

    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const POWER_SUPPLY_CATEGORY = 4
        let productImage: string | undefined
        try {
            const dto: IPowerSupply_Product_Form = req.body
            const validatedDto = await bodyValidator(validatePowerSupplyAndProductDto, dto)

            const newProduct = fromRequestToProduct({ ...validatedDto, id_category: POWER_SUPPLY_CATEGORY })
            await this.productService.verifyCategoryAndBrandExistence(newProduct.id_category, newProduct.id_brand)
            if (req.file) {
                const upload = await this.uploadService.uploadProduct(req.file)
                newProduct.image = upload.Location
                productImage = upload.Location
            } else {
                newProduct.image = null
            }
            const newPowerSupply = fromRequestToPowerSupplyCreate({ ...validatedDto, product: newProduct })
            const response = await this.powerSupplyService.create(newPowerSupply)
            res.status(StatusCodes.CREATED).send(response)
        } catch (err) {
            if (productImage) {
                this.uploadService.deleteProduct(productImage)
            }
            next(err)
        }
    }

    edit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        let powerSupply: PowerSupply | undefined
        try {
            const { id } = req.params
            const validId = numberParamOrError(id)
            const dto: IPowerSupplyEdit = req.body
            const validatedDto = await bodyValidator(validatePowerSupplyEditDto, dto)
            BaseError.validateNonEmptyForm(validatedDto)
            powerSupply = await this.powerSupplyService.modify(validId, validatedDto)
            res.status(StatusCodes.OK).send(powerSupply)
        } catch (err) {
            next(err)
        }
    }

    delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params
            const validId = numberParamOrError(id)
            await this.powerSupplyService.delete(validId)
            res.status(StatusCodes.NO_CONTENT).send({ message: "Power supply successfully deleted" })
        } catch (err) {
            next(err)
        }
    }
}