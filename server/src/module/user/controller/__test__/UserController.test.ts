import 'reflect-metadata'
import { UserController } from '../UserController'
import { mocked } from 'ts-jest/utils'
jest.mock('../../service/UserService')
import { Multer } from 'multer'
import { IUserService } from '../../interfaces/IUserService'
jest.mock('multer')
import { UserError } from '../../error/UserError'
import { IUserCreate } from '../../interfaces/IUserCreate'
import { AuthenticationError } from '../../../auth/error/AuthenticationError'
import { IUserEdit } from '../../interfaces/IUserEdit'
import { application, NextFunction, Request, Response } from 'express'
jest.mock('express')



let controller: UserController
const userService: IUserService = {
    createUser: jest.fn(),
    deleteUser: jest.fn(),
    findUserByMail: jest.fn(),
    getSingleUser: jest.fn(),
    getUsers: jest.fn(),
    modifyUser: jest.fn()
}

const uploadMiddleware: Multer = {
    any: jest.fn(),
    array: jest.fn(),
    fields: jest.fn(),
    none: jest.fn(),
    single: jest.fn()
}

const app = mocked(application, true)

const next: NextFunction = jest.fn()

const res = {
    status: jest.fn(() => res),
    send: jest.fn()
} as unknown as Response

const MOCK_USER = { name: 'carlos', role: 'admin' }

beforeAll(() => {
    controller = new UserController(userService, uploadMiddleware)
});

afterEach(() => {
    jest.clearAllMocks()
});

describe('Configure routes', () => {
    it('Should set routes to app correctly', () => {
        controller.configureRoutes(app)
        expect(app.get).toHaveBeenCalledTimes(2)
        expect(app.post).toHaveBeenCalledTimes(1)
        expect(app.put).toHaveBeenCalledTimes(1)
        expect(app.delete).toHaveBeenCalledTimes(1)
    });
});

describe('getUsers', () => {
    it('Should retrieve a list of users', async () => {
        const req = {
            query: {
                limit: '5',
                offset: '0'
            }
        } as unknown as Request

        const next: NextFunction = jest.fn()

        await controller.getUsers(req, res, next)
        expect(userService.getUsers).toBeCalledWith({ limit: 5, offset: 0 })
        expect(res.status).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledTimes(1)
    });

    it('Should throw error if invalid query', async () => {
        const req = {
            query: {
                limit: 'this-should-fail',
                offset: '0'
            }
        } as unknown as Request

        await controller.getUsers(req, res, next)
        expect(next).toHaveBeenCalledTimes(1)
    });
})

describe('getSingleUser', () => {
    it('should return an user ', async () => {

        const req = {
            user: MOCK_USER,
            params: {
                id: '3'
            }
        } as unknown as Request

        await controller.getSingleUser(req, res, next)

        expect(userService.getSingleUser).toHaveBeenCalledWith(3, MOCK_USER)
        expect(res.status).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledTimes(1)
    });

    it('should throw if user not logged ', async () => {
        const req = {
            params: {
                id: '3'
            }
        } as unknown as Request

        await controller.getSingleUser(req, res, next)

        expect(userService.getSingleUser).toHaveBeenCalledTimes(0)
        expect(next).toHaveBeenCalledTimes(1)
    });

    it('should throw if no user id param ', async () => {
        const req = {
            params: {},
            user: MOCK_USER
        } as unknown as Request

        await controller.getSingleUser(req, res, next)

        expect(userService.getSingleUser).toHaveBeenCalledTimes(0)
        expect(next).toHaveBeenCalledWith(UserError.idParamNotDefined())
    });
});

describe('createUser', () => {
    it('should create an user successfully', async () => {
        const userDto: IUserCreate = {
            mail: 'new_user@gmail.com',
            password: 'new_user_password',
            role_id: 2
        }
        const req = {
            body: userDto
        } as unknown as Request
        await controller.createUser(req, res, next)
        expect(userService.createUser).toHaveBeenCalledTimes(1)
        expect(userService.createUser).toHaveBeenCalledWith(userDto)
        expect(res.send).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledTimes(1)
    });

    it('should throw if no user in req.body', async () => {
        const req = {
            body: {}
        } as unknown as Request
        await controller.createUser(req, res, next)
        expect(next).toHaveBeenCalledTimes(1)
    })
});

describe('deleteUser', () => {
    it('should delete an user', async () => {
        const req = {
            user: MOCK_USER,
            params: { id: '5' }
        } as unknown as Request
        await controller.deleteUser(req, res, next)
        expect(userService.deleteUser).toHaveBeenCalledTimes(1)
        expect(userService.deleteUser).toHaveBeenCalledWith(5, MOCK_USER)
    });

    it('should throw if invalid user id', async () => {
        const INVALID_ID = 'INVALID_ID'
        const req = {
            user: MOCK_USER,
            params: { id: INVALID_ID }
        } as unknown as Request
        await controller.deleteUser(req, res, next)
        expect(userService.deleteUser).toHaveBeenCalledTimes(0)
        expect(next).toHaveBeenCalledTimes(1)
    });

    it('should throw if user not logged', async () => {
        const req = {
            params: { id: 5 }
        } as unknown as Request
        await controller.deleteUser(req, res, next)
        expect(userService.deleteUser).toHaveBeenCalledTimes(0)
        expect(next).toHaveBeenCalledWith(AuthenticationError.notLogged())
    });
});

describe('editUser', () => {
    it('should edit an user', async () => {
        const USER_DTO: IUserEdit = {
            mail: 'new_mail@gmail.com'
        }
        const req = {
            user: MOCK_USER,
            params: { id: 5 },
            body: USER_DTO
        } as unknown as Request

        await controller.editUser(req, res, next)
        expect(userService.modifyUser).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledTimes(1)
        expect(res.send).toHaveBeenCalledTimes(1)
    });
    it('should throw if user not logged', async () => {
        const req = {
            user: undefined,
            params: { id: 5 }
        } as unknown as Request
        await controller.editUser(req, res, next)
        expect(userService.modifyUser).toHaveBeenCalledTimes(0)
        expect(next).toHaveBeenCalledWith(AuthenticationError.notLogged())
    });

    it('should throw if invalid user id', async () => {
        const INVALID_ID = 'INVALID_ID'
        const req = {
            user: MOCK_USER,
            params: { id: INVALID_ID }
        } as unknown as Request
        await controller.editUser(req, res, next)
        expect(userService.modifyUser).toHaveBeenCalledTimes(0)
        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith(UserError.invalidId())
    });
});