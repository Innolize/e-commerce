import { Application, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { inject } from "inversify";
import { Multer } from "multer";
import { RAM_VERSION } from "../../../../config/constants/pcbuilder";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractController } from "../../../abstractClasses/abstractController";
import { bodyValidator } from "../../../common/helpers/bodyValidator";
import { validateRamQuerySchema } from "../helpers/dto-validator";
import { IRamQuery } from "../interface/IRamQuery";
import { RamService } from "../service/ramService";

export class RamController extends AbstractController {
    private ROUTE_BASE: string
    private ramService: RamService;
    private uploadMiddleware: Multer
    constructor(
        @inject(TYPES.PCBuilder.Ram.Service) ramService: RamService,
        @inject(TYPES.Common.UploadMiddleware) uploadMiddleware: Multer,
    ) {
        super()
        this.ROUTE_BASE = "/ram"
        this.ramService = ramService
        this.uploadMiddleware = uploadMiddleware
    }
    configureRoutes(app: Application): void {
        const ROUTE = this.ROUTE_BASE
        app.get(`/api${ROUTE}`, this.getAll.bind(this))
    }

    getAll = async (req: Request, res: Response): Promise<Response> => {
        const queryDto = req.query
        try {
            if (queryDto) {
                const validQueryDto = await bodyValidator(validateRamQuerySchema, queryDto as IRamQuery)
                console.log(validQueryDto)
                const ramWithQuery = await this.ramService.getRams(validQueryDto)
                return res.status(StatusCodes.OK).send(ramWithQuery)
            }
            const response = await this.ramService.getRams()
            return res.status(200).send(response)
        } catch (err) {
            return res.status(StatusCodes.NOT_FOUND).send({ error: err.message })
        }
    }


}