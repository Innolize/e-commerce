import { Application, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { inject } from "inversify";
import { Multer } from "multer";
import { TYPES } from "../../../config/inversify.types";
import { AbstractController } from "../../abstractClasses/abstractController";
import { jwtAuthentication } from "../../auth/util/passportMiddlewares";
import { authorizationMiddleware } from "../../authorization/util/authorizationMiddleware";
import { bodyValidator, mapperMessageError } from "../../common/helpers/bodyValidator";
import { idNumberOrError } from "../../common/helpers/idNumberOrError";
import { UserError } from "../error/UserError";
import { validateCreateUserDto } from "../helper/create_dto_validator";
import { validateEditUserDto } from "../helper/edit_dto_validator";
import { IUserCreate } from "../interfaces/IUserCreate";
import { IUserEdit } from "../interfaces/IUserEdit";
import { fromRequestToUser } from "../mapper/userMapper";
import { UserService } from "../service/UserService";


export class UserController extends AbstractController {
    private ROUTE_BASE: string
    private userService: UserService
    private uploadMiddleware: Multer
    constructor(
        @inject(TYPES.User.Service) userService: UserService,
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
        app.delete(`/api${ROUTE}/:id`, [jwtAuthentication, authorizationMiddleware({ action: 'delete', subject: 'User' })], this.createUser.bind(this))
    }

    async getUsers(req: Request, res: Response): Promise<Response> {
        const response = await this.userService.getUsers()
        return res.status(StatusCodes.OK).send(response)
    }

    async getSingleUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const response = await this.userService.getSingleUser(Number(id))
            return res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
        }

    }

    async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const dto: IUserCreate = req.body
            const validatedDto = await bodyValidator(validateCreateUserDto, dto)
            const user = fromRequestToUser(validatedDto)
            const createdUser = await this.userService.createUser(user)
            return res.status(StatusCodes.CREATED).send(createdUser)
        } catch (err) {
            next(err)
        }
    }

    async deleteUser(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        try {
            const idNumber = Number(id)
            if (!idNumber || idNumber <= 0) {
                throw UserError.invalidId()
            }
            const response = await this.userService.deleteUser(idNumber)
            return res.status(StatusCodes.OK).send(response)
        } catch (err) {
            next(err)
        }
    }

    async editUser(req: Request, res: Response, next: NextFunction) {
        try {
            const dto: IUserEdit = req.body
            const validDto = await bodyValidator(validateEditUserDto, dto)
            const editedUser = await this.userService.modifyUser(validDto)
            return res.status(200).send(editedUser)
        } catch (err) {
            next(err)
        }
    }
}