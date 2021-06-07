import { Application, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { inject } from "inversify";
import { Multer } from "multer";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractController } from "../../../abstractClasses/abstractController";
import { bodyValidator } from "../../../common/helpers/bodyValidator";
import { ImageUploadService } from "../../../imageUploader/module";
import { PowerSupply } from "../entities/PowerSupply";
import { validatePowerSupplyAndProductDto, validatePowerSupplyEditDto, validatePowerSupplyQuerySchema } from "../helpers/dto-validator";
import { IPowerSupply_Product } from "../interface/IPowerSupplyCreate";
import { IPowerSupplyQuery } from "../interface/IPowerSupplyQuery";
import { IPowerSupplyEdit } from '../interface/IPowerSupplyEdit'
import { PowerSupplyService } from "../service/PowerSupplyService";
import { idNumberOrError } from "../../../common/helpers/idNumberOrError";
import { jwtAuthentication } from "../../../auth/util/passportMiddlewares";
import { authorizationMiddleware } from "../../../authorization/util/authorizationMiddleware";
import { fromRequestToProduct } from "../../../product/mapper/productMapper";
import { fromRequestToPowerSupply } from "../mapper/powerSupplyMapper";
import { ProductService } from "../../../product/module";
import { PowerSupplyError } from "../error/PowerSupplyError";

export class PowerSupplyController extends AbstractController {
    private ROUTE_BASE: string
    private powerSupplyService: PowerSupplyService;
    private uploadMiddleware: Multer
    private uploadService: ImageUploadService
    private productService: ProductService
    constructor(
        @inject(TYPES.PCBuilder.PowerSupply.Service) powerSupplyService: PowerSupplyService,
        @inject(TYPES.Common.UploadMiddleware) uploadMiddleware: Multer,
        @inject(TYPES.ImageUploader.Service) uploadService: ImageUploadService,
        @inject(TYPES.Product.Service) productService: ProductService
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
        app.get(`/api${ROUTE}/:id`, this.getSinglePowerSupply.bind(this))
        app.post(`/api${ROUTE}`, [jwtAuthentication, authorizationMiddleware({ action: 'create', subject: 'PowerSupply' })], this.uploadMiddleware.single("product_image"), this.create.bind(this))
        app.put(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'update', subject: 'PowerSupply' })], this.uploadMiddleware.none(), this.edit.bind(this))
        app.delete(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'delete', subject: 'PowerSupply' })], this.delete.bind(this))
    }

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const queryDto = req.query
            const hasQuery = Object.keys(queryDto).length
            if (hasQuery) {
                const validQueryDto = await bodyValidator(validatePowerSupplyQuerySchema, queryDto as IPowerSupplyQuery)
                const powerSuppliesWithQuery = await this.powerSupplyService.getPowerSupply(validQueryDto)
                return res.status(StatusCodes.OK).send(powerSuppliesWithQuery)
            }
            const response = await this.powerSupplyService.getPowerSupply()
            return res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
        }
    }

    getSinglePowerSupply = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params
            const validId = idNumberOrError(id) as number
            const response = await this.powerSupplyService.getSinglePowerSupply(validId) as PowerSupply
            return res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
        }
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        const POWER_SUPPLY_CATEGORY = 4
        let productImage: string | undefined
        try {
            const dto: IPowerSupply_Product = req.body
            const validatedDto = await bodyValidator(validatePowerSupplyAndProductDto, dto)
            const newPowerSupply = fromRequestToPowerSupply(validatedDto)
            const newProduct = fromRequestToProduct({ ...validatedDto, id_category: POWER_SUPPLY_CATEGORY })
            await this.productService.verifyCategoryAndBrandExistence(newProduct.id_category, newProduct.id_brand)
            if (req.file) {
                const { buffer, originalname } = req.file
                const upload = await this.uploadService.uploadProduct(buffer, originalname)
                newProduct.image = upload.Location
                productImage = upload.Location
            } else {
                newProduct.image = null
            }
            const response = await this.powerSupplyService.createPowerSupply(newProduct, newPowerSupply)
            return res.status(StatusCodes.CREATED).send(response)
        } catch (err) {
            if (productImage) {
                this.uploadService.deleteProduct(productImage)
            }
            next(err)
        }
    }

    edit = async (req: Request, res: Response, next: NextFunction) => {
        let powerSupply: PowerSupply | undefined
        try {
            const { id } = req.params
            const validId = idNumberOrError(id) as number
            const dto: IPowerSupplyEdit = req.body
            const validatedDto = await bodyValidator(validatePowerSupplyEditDto, dto)
            powerSupply = await this.powerSupplyService.modifyPowerSupply(validId, validatedDto) as PowerSupply
            return res.status(StatusCodes.OK).send(powerSupply)
        } catch (err) {
            next(err)
        }
    }

    delete = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params
        try {
            const idNumber = Number(id)
            if (!idNumber || idNumber <= 0) {
                throw PowerSupplyError.invalidId()
            }
            await this.powerSupplyService.deletePowerSupply(idNumber)
            return res.status(StatusCodes.NO_CONTENT).send({ message: "Power supply successfully deleted" })
        } catch (err) {
            next(err)
        }
    }
}