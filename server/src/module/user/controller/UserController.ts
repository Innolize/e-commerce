import { Application, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { inject } from "inversify";
import { Multer } from "multer";
import { TYPES } from "../../../config/inversify.types";
import { AbstractController } from "../../abstractClasses/abstractController";
import { jwtAuthentication } from "../../auth/util/passportMiddlewares";
import { authorizationMiddleware } from "../../authorization/util/authorizationMiddleware";
import { bodyValidator } from "../../common/helpers/bodyValidator";
import { GetUserReqDto } from "../dto/getUsersReqDto";
import { UserError } from "../error/UserError";
import { validateCreateUserDto } from "../helper/create_dto_validator";
import { validateEditUserDto } from "../helper/edit_dto_validator";
import { validateGetUsersDto } from "../helper/get_dto_validator";
import { IUserController } from "../interfaces/IUserController";
import { IUserCreate } from "../interfaces/IUserCreate";
import { IUserEdit } from "../interfaces/IUserEdit";
import { IUserService } from "../interfaces/IUserService";

export class UserController extends AbstractController implements IUserController {
    private ROUTE_BASE: string
    private uploadMiddleware: Multer
    constructor(
        @inject(TYPES.User.Service) private userService: IUserService,
        @inject(TYPES.Common.UploadMiddleware) uploadMiddleware: Multer
    ) {
        super()
        this.ROUTE_BASE = "/user"
        this.userService = userService
        this.uploadMiddleware = uploadMiddleware
    }

    configureRoutes(app: Application): void {
        const ROUTE = this.ROUTE_BASE
        app.get(`/api${ROUTE}`, this.getUsers.bind(this))
        app.get(`/api${ROUTE}/:id`, this.getSingleUser.bind(this))
        app.post(`/api${ROUTE}`, this.uploadMiddleware.none(), this.createUser.bind(this))
        app.delete(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'delete', subject: 'User' })], this.deleteUser.bind(this))
    }

    async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        const dto: IUserGetUsers = req.query
        try {
            const { limit, offset } = await bodyValidator(validateGetUsersDto, dto)
            const searchParam = new GetUserReqDto(limit, offset)
            const response = await this.userService.getUsers(searchParam)
            res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
        }
    }

    async getSingleUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params
            const response = await this.userService.getSingleUser(Number(id))
            res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
        }

    }

    async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dto: IUserCreate = req.body
            const validatedDto = await bodyValidator(validateCreateUserDto, dto)
            const createdUser = await this.userService.createUser(validatedDto)
            res.status(StatusCodes.CREATED).send(createdUser)
        } catch (err) {
            next(err)
        }
    }

    async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params
        try {
            const idNumber = Number(id)
            if (!idNumber || idNumber <= 0) {
                throw UserError.invalidId()
            }
            const response = await this.userService.deleteUser(idNumber)
            res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
        }
    }

    async editUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dto: IUserEdit = req.body
            const validDto = await bodyValidator(validateEditUserDto, dto)
            const editedUser = await this.userService.modifyUser(validDto)
            res.status(200).send(editedUser)
        } catch (err) {
            next(err)
        }
    }
}