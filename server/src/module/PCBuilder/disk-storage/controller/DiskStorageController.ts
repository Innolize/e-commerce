import { ManagedUpload } from "aws-sdk/clients/s3";
import { Application, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { inject } from "inversify";
import { Multer } from "multer";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractController } from "../../../abstractClasses/abstractController";
import { bodyValidator, mapperMessageError } from "../../../common/helpers/bodyValidator";
import { ImageUploadService } from "../../../imageUploader/module";
import { Product } from "../../../product/entity/Product";
import { DiskStorage } from "../entities/DiskStorage";
import { validateRamAndProductDto, validateRamEditDto, validateRamQuerySchema } from "../helpers/dto-validator";
import { IDiskStorage_Product } from "../interface/IDiskStorageCreate";
import { IDiskStorageQuery } from "../interface/IDiskStorageQuery";
import { IDiskStorageEdit } from '../interface/IDiskStorageEdit'
import { DiskStorageService } from "../service/DiskStorageService";
import { FullDiskStorage } from "../entities/FullDiskStorage";
import { idNumberOrError } from "../../../common/helpers/idNumberOrError";

export class DiskStorageController extends AbstractController {
    private ROUTE_BASE: string
    private diskStorageService: DiskStorageService;
    private uploadMiddleware: Multer
    private uploadService: ImageUploadService
    constructor(
        @inject(TYPES.PCBuilder.DiskStorage.Service) diskStorageService: DiskStorageService,
        @inject(TYPES.Common.UploadMiddleware) uploadMiddleware: Multer,
        @inject(TYPES.ImageUploader.Service) uploadService: ImageUploadService
    ) {
        super()
        this.ROUTE_BASE = "/disk-storage"
        this.diskStorageService = diskStorageService
        this.uploadMiddleware = uploadMiddleware
        this.uploadService = uploadService
    }
    configureRoutes(app: Application): void {
        const ROUTE = this.ROUTE_BASE
        app.get(`/api${ROUTE}`, this.getAll.bind(this))
        app.get(`/api${ROUTE}/:id`, this.getSingleDisk.bind(this))
        app.post(`/api${ROUTE}`, this.uploadMiddleware.single("product_image"), this.create.bind(this))
        app.put(`/api${ROUTE}/:id`, this.uploadMiddleware.none(), this.edit.bind(this))
        app.delete(`/api${ROUTE}/:id`, this.delete.bind(this))
    }

    getAll = async (req: Request, res: Response): Promise<Response> => {
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
            return res.status(StatusCodes.NOT_FOUND).send({ error: err.message })
        }
    }

    getSingleDisk = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params
            const validId = idNumberOrError(id) as number
            const response = await this.diskStorageService.getSingleDisk(validId) as FullDiskStorage
            return res.status(StatusCodes.OK).send(response)
        } catch (err) {
            if (err.isJoi) {
                return res.status(StatusCodes.BAD_REQUEST).send({ error: err.message })
            }
            return res.status(StatusCodes.NOT_FOUND).send({ error: err.message })
        }
    }

    create = async (req: Request, res: Response): Promise<Response> => {
        let upload: ManagedUpload.SendData | undefined
        try {
            const dto: IDiskStorage_Product = req.body
            await bodyValidator(validateRamAndProductDto, dto)
            const newDiskStorage = new DiskStorage(dto)
            const newProduct = new Product(dto)
            if (req.file) {
                const { buffer, originalname } = req.file
                upload = await this.uploadService.uploadProduct(buffer, originalname)
                newProduct.image = upload.Location
            } else {
                newProduct.image = null
            }
            const response = await this.diskStorageService.createDisk(newProduct, newDiskStorage)
            return res.status(200).send(response)
        } catch (err) {
            if (err.isJoi) {
                const joiErrors = mapperMessageError(err)
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).send(joiErrors)
            }
            if (req.file && upload) {
                this.uploadService.deleteProduct(upload.Location)
            }
            return res.status(200).send(err)
        }
    }

    edit = async (req: Request, res: Response): Promise<Response> => {
        let disk: DiskStorage | undefined
        try {
            const { id } = req.params
            const validId = idNumberOrError(id) as number
            const dto: IDiskStorageEdit = req.body
            const validatedDto = await bodyValidator(validateRamEditDto, dto)
            disk = await this.diskStorageService.modifyDisk(validId, validatedDto) as DiskStorage
            return res.status(StatusCodes.OK).send(disk)
        } catch (err) {
            if (err.isJoi === true) {
                const errorArray = mapperMessageError(err)
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({
                    errors: errorArray
                })
            }
            return res.status(StatusCodes.BAD_REQUEST).send({ message: err.message })
        }
    }

    delete = async (req: Request, res: Response): Promise<Response | Error> => {
        try {
            const { id } = req.params
            const validId = idNumberOrError(id) as number
            await this.diskStorageService.deleteDisk(validId)
            return res.status(StatusCodes.OK).send({ message: "Disk storage successfully deleted" })
        } catch (err) {
            if (err.isJoi) {
                return res.status(StatusCodes.BAD_REQUEST).send({ error: err.message })
            }
            return res.status(StatusCodes.BAD_REQUEST).send({ error: err.message })
        }
    }
}