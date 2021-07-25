import { Application, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { inject } from "inversify";
import { Multer } from "multer";
import { TYPES } from "../../../config/inversify.types";
import { AbstractController } from "../../abstractClasses/abstractController";
import { AuthenticationError } from "../../auth/error/AuthenticationError";
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
import { IUserGetUsers } from "../interfaces/IUserGetUsers";
import { IUserService } from "../interfaces/IUserService";

export class UserController extends AbstractController implements IUserController {
    private ROUTE_BASE: string
    constructor(
        @inject(TYPES.User.Service) private userService: IUserService,
        @inject(TYPES.Common.UploadMiddleware) private uploadMiddleware: Multer
    ) {
        super()
        this.ROUTE_BASE = "/user"
        this.userService = userService
        this.uploadMiddleware = uploadMiddleware
    }

    configureRoutes(app: Application): void {
        const ROUTE = this.ROUTE_BASE
        app.get(`/api${ROUTE}`, [jwtAuthentication, authorizationMiddleware({ action: 'read', subject: 'User' })], this.getUsers.bind(this))
        app.get(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'read', subject: 'User' })], this.getSingleUser.bind(this))
        app.post(`/api${ROUTE}`, [jwtAuthentication, authorizationMiddleware({ action: 'create', subject: 'User' })], this.uploadMiddleware.none(), this.createUser.bind(this))
        app.put(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'update', subject: 'User' })], this.uploadMiddleware.none(), this.editUser.bind(this))
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
            const user = req.user
            if (!user) {
                throw AuthenticationError.notLogged()
            }
            const { id: idParam } = req.params
            const id = Number(idParam)
            if (!id) {
                throw UserError.idParamNotDefined()
            }
            const response = await this.userService.getSingleUser(id, user)
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
        try {
            const user = req.user
            if (!user) {
                throw AuthenticationError.notLogged()
            }
            const { id: idParam } = req.params
            const id = Number(idParam)
            if (!id || id <= 0) {
                throw UserError.invalidId()
            }
            const response = await this.userService.deleteUser(id, user)
            res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
        }
    }

    async editUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = req.user
            if (!user) {
                throw AuthenticationError.notLogged()
            }
            const { id: idParam } = req.params
            const id = Number(idParam)
            if (!id || id <= 0) {
                throw UserError.invalidId()
            }
            const dto: IUserEdit = req.body
            const validDto = await bodyValidator(validateEditUserDto, dto)
            const editedUser = await this.userService.modifyUser(id, validDto, user)
            res.status(200).send(editedUser)
        } catch (err) {
            next(err)
        }
    }
}