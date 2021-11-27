import { Application, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { inject } from "inversify";
import { Multer } from "multer";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractController } from "../../../abstractClasses/abstractController";
import { bodyValidator } from "../../../common/helpers/bodyValidator";
import { DiskStorage } from "../entities/DiskStorage";
import { validateDiskStorageAndProductDto, validateDiskStorageEditDto, validateDiskStorageQuerySchema } from "../helpers/dto-validator";
import { IDiskStorage_Product_Form } from "../interface/IDiskStorageCreate";
import { IDiskStorageGetAllQuery } from "../interface/IDiskStorageGetAllQuery";
import { IDiskStorageEdit } from '../interface/IDiskStorageEdit'
import { numberParamOrError } from "../../../common/helpers/numberParamOrError";
import { jwtAuthentication } from "../../../auth/util/passportMiddlewares";
import { authorizationMiddleware } from "../../../authorization/util/authorizationMiddleware";
import { fromRequestToProduct } from "../../../product/mapper/productMapper";
import { GetDiskStorageReqDto } from '../dto/getDiskStorageReqDto'
import { IImageUploadService } from "../../../imageUploader/interfaces/IImageUploadService";
import { IDiskStorageService } from "../interface/IDiskStorageService";
import { IProductService } from "../../../product/interfaces/IProductService";
import { fromRequestToDiskStorageCreate } from "../mapper/diskStorageMapper";

export class DiskStorageController extends AbstractController {
    private ROUTE_BASE: string

    constructor(
        @inject(TYPES.PCBuilder.DiskStorage.Service) private diskStorageService: IDiskStorageService,
        @inject(TYPES.Common.UploadMiddleware) private uploadMiddleware: Multer,
        @inject(TYPES.ImageUploader.Service) private uploadService: IImageUploadService,
        @inject(TYPES.Product.Service) private productService: IProductService
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

    getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const dto: IDiskStorageGetAllQuery = req.query
            const { limit, offset, type } = await bodyValidator(validateDiskStorageQuerySchema, dto)
            const queryParams = new GetDiskStorageReqDto(limit, offset, type)
            const response = await this.diskStorageService.getDisks(queryParams)
            res.status(200).send(response)
        } catch (err) {
            next(err)
            return
        }
    }

    getSingleDisk = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params
            const validId = numberParamOrError(id)
            const response = await this.diskStorageService.getSingleDisk(validId) as DiskStorage
            res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
            return
        }
    }

    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const DISK_STORAGE_CATEGORY = 1
        let productImage: string | undefined
        try {
            const dto: IDiskStorage_Product_Form = req.body
            const validatedDto = await bodyValidator(validateDiskStorageAndProductDto, dto)
            const newProduct = fromRequestToProduct({ ...validatedDto, id_category: DISK_STORAGE_CATEGORY })
            await this.productService.verifyCategoryAndBrandExistence(newProduct.id_category, newProduct.id_brand)
            const newDiskStorage = fromRequestToDiskStorageCreate({ ...validatedDto, product: newProduct })
            if (req.file) {
                const upload = await this.uploadService.uploadProduct(req.file)
                newProduct.image = upload.Location
                productImage = upload.Location
            } else {
                newProduct.image = null
            }
            const response = await this.diskStorageService.createDisk(newDiskStorage)
            res.status(StatusCodes.CREATED).send(response)
        } catch (err) {
            if (productImage) {
                this.uploadService.deleteProduct(productImage)
            }
            next(err)
        }
    }

    edit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params
            const validId = numberParamOrError(id)
            const dto: IDiskStorageEdit = req.body
            const validatedDto = await bodyValidator(validateDiskStorageEditDto, dto)
            const modifieddisk = await this.diskStorageService.modifyDisk(validId, validatedDto)
            res.status(StatusCodes.OK).send(modifieddisk)
        } catch (err) {
            next(err)
        }
    }

    delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params
            const validId = numberParamOrError(id)
            await this.diskStorageService.deleteDisk(validId)
            res.status(StatusCodes.OK).send({ message: "Disk storage successfully deleted" })
        } catch (err) {
            next(err)
        }
    }
}