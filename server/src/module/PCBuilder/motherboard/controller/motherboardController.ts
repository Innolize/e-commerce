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
import { Motherboard } from "../entity/Motherboard";
import { validateMotherboardAndProductDto } from "../helpers/create.dto";
import { IMotherboard_Product } from "../interface/IMotherboardCreate";
import { MotherboardService } from "../service/motherboardService";

export class MotherboardController extends AbstractController {
    private ROUTE_BASE: string
    private motherboardService: MotherboardService;
    private uploadMiddleware: Multer
    private uploadService: ImageUploadService
    constructor(
        @inject(TYPES.PCBuilder.Motherboard.Service) motherboardService: MotherboardService,
        @inject(TYPES.Common.UploadMiddleware) uploadMiddleware: Multer,
        @inject(TYPES.ImageUploader.Service) uploadService: ImageUploadService
    ) {
        super()
        this.ROUTE_BASE = "/motherboard"
        this.motherboardService = motherboardService
        this.uploadMiddleware = uploadMiddleware
        this.uploadService = uploadService
    }
    configureRoutes(app: Application): void {
        const ROUTE = this.ROUTE_BASE
        app.get(`/api${ROUTE}`, this.getAll.bind(this))
        app.post(`/api${ROUTE}`, this.uploadMiddleware.single("test"), this.create.bind(this))
        app.put(`/api${ROUTE}`, this.edit.bind(this))
        app.delete(`/api${ROUTE}`, this.delete.bind(this))
        app.get(`/api${ROUTE}`, this.filter.bind(this))
    }

    getAll = async (req: Request, res: Response): Promise<Response> => {
        try {
            const response = await this.motherboardService.getMotherboards()
            return res.status(200).send(response)
        } catch (err) {
            return res.status(StatusCodes.NOT_FOUND).send({ err: "Database Error" })
        }

    }

    create = async (req: Request, res: Response): Promise<Response> => {
        let upload: ManagedUpload.SendData | undefined
        try {
            const dto: IMotherboard_Product = req.body
            await bodyValidator(validateMotherboardAndProductDto, dto)
            const newMotherboard = new Motherboard(dto)
            const newProduct = new Product(dto)
            if (req.file) {
                const { buffer, filename } = req.file
                upload = await this.uploadService.uploadProduct(buffer, filename)
                newProduct.image = upload.Location
            } else {
                newProduct.image = null
            }
            const response = await this.motherboardService.createMotherboard(newProduct, newMotherboard)
            return res.status(200).send(response)
        } catch (err) {

            if (err.isJoi) {
                console.log('test')
                const joiErrors = mapperMessageError(err)
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).send(joiErrors)
            }
            if (req.file && upload) {
                this.uploadService.deleteProduct(upload.Location)
            }
            return res.status(200).send(err)
        }
    }

    edit = (req: Request, res: Response): Response => {
        return res.status(200).send("Test")
    }

    delete = (req: Request, res: Response): Response => {
        return res.status(200).send("Test")
    }

    filter = (req: Request, res: Response): Response => {
        return res.status(200).send("Test")
    }
}