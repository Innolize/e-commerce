import { Multer } from 'multer';
import 'reflect-metadata'
import { CategoryController } from '../categoryController';
import { application, NextFunction, Request, Response } from 'express'
import { mocked } from 'ts-jest/utils';
import { GetCategoriesReqDto } from '../../dto/getCategoriesReqDto';
import { ICategoryCreate } from '../../interfaces/ICategoryCreate';
import { ICategoryEdit } from '../../interfaces/ICategoryEdit';
import { CategoryError } from '../../error/CategoryError';
jest.mock('express')

let controller: CategoryController
const service = {
    createCategory: jest.fn(),
    deleteCategory: jest.fn(),
    findCategoryById: jest.fn(),
    getAllCategories: jest.fn(),
    modifyCategory: jest.fn()
}

const uploadMiddleware: Multer = {
    any: jest.fn(),
    array: jest.fn(),
    fields: jest.fn(),
    none: jest.fn(),
    single: jest.fn()
}

const app = mocked(application, true)

const res = {
    status: jest.fn(() => res),
    send: jest.fn()
} as Partial<Response> as Response

const next = jest.fn() as NextFunction

beforeAll(() => {
    controller = new CategoryController(service, uploadMiddleware)
});

afterEach(() => {
    jest.clearAllMocks()
});

describe('configureRoutes', () => {
    it('should configure routes successfully', async () => {
        controller.configureRoutes(app);
        expect(app.get).toHaveBeenCalledTimes(2)
        expect(app.post).toHaveBeenCalledTimes(1)
        expect(app.put).toHaveBeenCalledTimes(1)
        expect(app.delete).toHaveBeenCalledTimes(1)
    });
});

describe('getAllCategories', () => {
    it('Should retrieve a list of categories', async () => {
        const req = {
            query: {
                offset: '0',
                limit: '5',
                name: 'test'
            }
        } as Partial<Request> as Request

        const EXPECTED_GET_ALL_PARAMS: GetCategoriesReqDto = {
            name: 'test', offset: 0,
            limit: 5
        }
        await controller.getAllCategories(req, res, next)
        expect(service.getAllCategories).toHaveBeenCalledTimes(1)
        expect(service.getAllCategories).toHaveBeenCalledWith(EXPECTED_GET_ALL_PARAMS)
        expect(res.send).toHaveBeenCalledTimes(1)
    });

    it('should call next error handler if invalid queries', async () => {
        const req = {
            query: {
                offset: 'invalid-offset',
                limit: 'invalid-limit',
                name: 'test'
            }
        } as Partial<Request> as Request
        await controller.getAllCategories(req, res, next)
        expect(res.send).toHaveBeenCalledTimes(0)
        expect(next).toHaveBeenCalledTimes(1)
    });
});

describe('createCategory', () => {
    it('should successfully create a category', async () => {
        const body: ICategoryCreate = { name: 'new-category' }
        const req = {
            body
        } as Partial<Request> as Request
        await controller.createCategory(req, res, next)
        expect(service.createCategory).toHaveBeenCalledTimes(1)
        expect(service.createCategory).toHaveBeenCalledWith(body)
    });
});

describe('findCategoryById', () => {
    it('should retrieve a category with given id', async () => {
        const req = {
            params: {
                id: '5'
            }
        } as Partial<Request> as Request
        await controller.findCategoryById(req, res, next)
        expect(service.findCategoryById).toHaveBeenCalledTimes(1)
        expect(service.findCategoryById).toHaveBeenCalledWith(5)
    });
    it('should throw if invalid id', async () => {
        const INVALID_ID = '0'

        const req = {
            params: {
                id: INVALID_ID
            }
        } as Partial<Request> as Request
        await controller.findCategoryById(req, res, next)
        expect(next).toHaveBeenCalledTimes(1)
    });
});

describe('modifyCategory', () => {
    it('should successfully modify a category with given id', async () => {
        const newCategoryProps: ICategoryEdit = {
            name: 'new-name'
        }
        const req = {
            params: {
                id: '125'
            },
            body: newCategoryProps
        } as Partial<Request> as Request
        const EXPECTED_ID = 125

        await controller.modifyCategory(req, res, next)
        expect(service.modifyCategory).toHaveBeenCalledWith(EXPECTED_ID, newCategoryProps)
        expect(res.status).toHaveBeenCalledTimes(1)
    });

    it('should throw if req.body is empty', async () => {
        const req = {
            params: {
                id: '125'
            },
            body: {}
        } as Partial<Request> as Request

        await controller.modifyCategory(req, res, next)
        expect(next).toHaveBeenCalledTimes(1)
        expect(res.send).toHaveBeenCalledTimes(0)
    });
});

describe('deleteCategory', () => {
    it('should successfully delete a category', async () => {
        const req = {
            params: {
                id: '125'
            }
        } as Partial<Request> as Request
        const EXPECTED_RESPONSE = { message: "Category successfully deleted" }
        await controller.deleteCategory(req, res, next)
        expect(res.send).toHaveBeenCalledTimes(1)
        expect(res.send).toHaveBeenCalledWith(EXPECTED_RESPONSE)

    });

    it('should throw if id is not a number', async () => {
        const req = {
            params: {
                id: 'invalid-id'
            }
        } as Partial<Request> as Request
        await controller.deleteCategory(req, res, next);
        expect(next).toHaveBeenCalledTimes(1)
    });

    it('should throw if category belongs to pc-builder (1-7)', async () => {
        const req = {
            params: {
                id: '6'
            }
        } as Partial<Request> as Request
        await controller.deleteCategory(req, res, next)
        expect(next).toHaveBeenCalledWith(CategoryError.undeletableCategory())
    })

});