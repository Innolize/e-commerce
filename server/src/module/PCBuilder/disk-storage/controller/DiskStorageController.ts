import { Application, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { inject } from "inversify";
import { Multer } from "multer";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractController } from "../../../abstractClasses/abstractController";
import { bodyValidator } from "../../../common/helpers/bodyValidator";
import { ImageUploadService } from "../../../imageUploader/module";
import { DiskStorage } from "../entities/DiskStorage";
import { validateRamAndProductDto, validateRamEditDto, validateRamQuerySchema } from "../helpers/dto-validator";
import { IDiskStorage_Product } from "../interface/IDiskStorageCreate";
import { IDiskStorageQuery } from "../interface/IDiskStorageQuery";
import { IDiskStorageEdit } from '../interface/IDiskStorageEdit'
import { DiskStorageService } from "../service/DiskStorageService";
import { idNumberOrError } from "../../../common/helpers/idNumberOrError";
import { jwtAuthentication } from "../../../auth/util/passportMiddlewares";
import { authorizationMiddleware } from "../../../authorization/util/authorizationMiddleware";
import { fromRequestToProduct } from "../../../product/mapper/productMapper";
import { fromRequestToDiskStorage } from "../mapper/diskStorageMapper";
import { ProductService } from "../../../product/module";

export class DiskStorageController extends AbstractController {
    private ROUTE_BASE: string
    private diskStorageService: DiskStorageService;
    private uploadMiddleware: Multer
    private uploadService: ImageUploadService
    private productService: ProductService

    constructor(
        @inject(TYPES.PCBuilder.DiskStorage.Service) diskStorageService: DiskStorageService,
        @inject(TYPES.Common.UploadMiddleware) uploadMiddleware: Multer,
        @inject(TYPES.ImageUploader.Service) uploadService: ImageUploadService,
        @inject(TYPES.Product.Service) productService: ProductService

    ) {
        super()
        this.ROUTE_BASE = "/disk-storage"
        this.diskStorageService = diskStorageService
        this.uploadMiddleware = uploadMiddleware
        this.uploadService = uploadService
        this.productService = productService
    }
    configureRoutes(app: Application): void {
        const ROUTE = this.ROUTE_BASE
        app.get(`/api${ROUTE}`, this.getAll.bind(this))
        app.get(`/api${ROUTE}/:id`, this.getSingleDisk.bind(this))
        app.post(`/api${ROUTE}`, [jwtAuthentication, authorizationMiddleware({ action: 'create', subject: 'DiskStorage' })], this.uploadMiddleware.single("product_image"), this.create.bind(this))
        app.put(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'update', subject: 'DiskStorage' })], this.uploadMiddleware.none(), this.edit.bind(this))
        app.delete(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'delete', subject: 'DiskStorage' })], this.delete.bind(this))
    }

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const queryDto = req.query
            const hasQuery = Object.keys(queryDto).length
            if (hasQuery) {
                const validQueryDto = await bodyValidator(validateRamQuerySchema, queryDto as IDiskStorageQuery)
                const diskWithQuery = await this.diskStorageService.getDisks(validQueryDto)
                return res.status(StatusCodes.OK).send(diskWithQuery)
            }
            const response = await this.diskStorageService.getDisks()
            return res.status(200).send(response)
        } catch (err) {
            next(err)
            return
        }
    }

    getSingleDisk = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params
            const validId = idNumberOrError(id) as number
            const response = await this.diskStorageService.getSingleDisk(validId) as DiskStorage
            return res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
            return
        }
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        let productImage: string | undefined
        try {
            const dto: IDiskStorage_Product = req.body
            const validatedDto = await bodyValidator(validateRamAndProductDto, dto)
            const newDiskStorage = fromRequestToDiskStorage(validatedDto)
            const newProduct = fromRequestToProduct(validatedDto)
            await this.productService.verifyCategoryAndBrandExistence(newProduct.id_category, newProduct.id_brand)
            if (req.file) {
                const { buffer, originalname } = req.file
                const upload = await this.uploadService.uploadProduct(buffer, originalname)
                newProduct.image = upload.Location
                productImage = upload.Location
            } else {
                newProduct.image = null
            }
            const response = await this.diskStorageService.createDisk(newProduct, newDiskStorage)
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
            const dto: IDiskStorageEdit = req.body
            const validatedDto = await bodyValidator(validateRamEditDto, dto)
            const modifieddisk = await this.diskStorageService.modifyDisk(validId, validatedDto) as DiskStorage
            return res.status(StatusCodes.OK).send(modifieddisk)
        } catch (err) {
            next(err)
        }
    }

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params
            const validId = idNumberOrError(id) as number
            await this.diskStorageService.deleteDisk(validId)
            return res.status(StatusCodes.OK).send({ message: "Disk storage successfully deleted" })
        } catch (err) {
            next(err)
        }
    }
}