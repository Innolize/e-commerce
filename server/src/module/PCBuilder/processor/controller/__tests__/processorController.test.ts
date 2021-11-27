import 'reflect-metadata'
import { application, Request, Response } from 'express'
import { mocked } from 'ts-jest/utils'
import { Multer } from 'multer'
import { IProductService } from '../../../../product/interfaces/IProductService'
import { ProcessorController } from '../ProcessorController'
import { StatusCodes } from 'http-status-codes'
import { IProcessorEdit } from '../../interface/IProcessorEdit'
import { IProcessorCreate } from '../../interface/IProcessorCreate'
import { IProductCreate } from '../../../../product/interfaces/IProductCreate'

import { fromRequestToProcessorCreate } from '../../mapper/processorMapper'
import { GetProcessorReqDto } from '../../dto/getProcessorReqDto'

jest.mock('express')
const app = mocked(application, true)

const processorService = {
    create: jest.fn(),
    delete: jest.fn(),
    getAll: jest.fn(),
    getSingle: jest.fn(),
    modify: jest.fn()
}

const uploadMiddleware: Multer = {
    any: jest.fn(),
    array: jest.fn(),
    fields: jest.fn(),
    none: jest.fn(),
    single: jest.fn()
}

const imageUpload = {
    deleteBrand: jest.fn(),
    deleteProduct: jest.fn(),
    uploadBrand: jest.fn(),
    uploadProduct: jest.fn(),
}

const productService: IProductService = {
    createProduct: jest.fn(),
    deleteProduct: jest.fn(),
    findProductById: jest.fn(),
    getAllProducts: jest.fn(),
    modifyProduct: jest.fn(),
    verifyCategoryAndBrandExistence: jest.fn()
}

const next = jest.fn()

const res = {
    status: jest.fn(() => res),
    send: jest.fn()
} as unknown as Response


const mockFile = {
    fieldname: 'product_image',
    originalname: 'product.png',
    encoding: '7bit',
    mimetype: 'image/png',
    buffer: Buffer.from('hellow world', 'utf-8'),
    size: 118057,
}

const TEST_ERROR = new Error('test-error')

let controller: ProcessorController

beforeEach(() => {
    controller = new ProcessorController(processorService, uploadMiddleware, imageUpload, productService)
});

afterEach(() => {
    jest.clearAllMocks()
});

describe('configureRoutes', () => {
    it('should configure routes correctly ', () => {
        controller.configureRoutes(app)
        expect(app.get).toHaveBeenCalledTimes(2)
        expect(app.post).toHaveBeenCalledTimes(1)
        expect(app.put).toHaveBeenCalledTimes(1)
        expect(app.delete).toHaveBeenCalledTimes(1)
    });
});

describe('getAll', () => {
    const QUERY_PARAMS: GetProcessorReqDto = { limit: 10, offset: 0 }
    const req = {
        query: QUERY_PARAMS
    } as unknown as Request

    it('should work correctly ', async () => {
        await controller.getAll(req, res, next)
        expect(processorService.getAll).toHaveBeenCalledWith(QUERY_PARAMS)
        expect(res.send).toHaveBeenCalledTimes(1)
        expect(res.send).toHaveBeenCalledWith(undefined)
        expect(res.status).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledWith(200)
    });

    it('should call next function if error is thrown', async () => {
        processorService.getAll.mockImplementationOnce(() => Promise.reject(TEST_ERROR))
        await controller.getAll(req, res, next)
        expect(next).toHaveBeenCalledWith(TEST_ERROR)
    });
});

describe('getSingle', () => {
    const ID_PARAM = 5
    const req = {
        params: {
            id: ID_PARAM
        }
    } as unknown as Request

    it('should work correctly ', async () => {
        await controller.getSingle(req, res, next)
        expect(processorService.getSingle).toHaveBeenCalledWith(ID_PARAM)
        expect(res.send).toHaveBeenCalledTimes(1)
        expect(res.send).toHaveBeenCalledWith(undefined)
        expect(res.status).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledWith(200)
    });
    it('should call next function if error is thrown ', async () => {
        processorService.getSingle.mockImplementationOnce(() => Promise.reject(TEST_ERROR))
        await controller.getSingle(req, res, next)
        expect(next).toHaveBeenCalledWith(TEST_ERROR)
    });
});

describe('create', () => {


    it('should create a processor', async () => {

        const product: IProductCreate = {
            description: 'test-description',
            id_brand: 1,
            id_category: 5,
            image: null,
            name: 'test-name',
            price: 120,
            stock: true
        }
        const processor: IProcessorCreate = {
            cores:3,
            frecuency:1000,
            socket:'ax1',
            watts: 40,
        }

        const req = {
            body: { ...product, ...processor }
        } as unknown as Request
        const newMotherboard = fromRequestToProcessorCreate({ ...processor, product })

        await controller.create(req, res, next)
        expect(processorService.create).toHaveBeenCalledWith(newMotherboard)
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.send).toHaveBeenCalledWith(undefined)
    });

    it('should call next if validation error is thrown', async () => {
        const INVALID_PRICE = 'invalid price'
        const product = {
            description: 'test-description',
            id_brand: 1,
            id_category: 1,
            image: null,
            name: 'test-name',
            price: INVALID_PRICE,
            stock: true
        }

        const disk: IProcessorCreate = {
            cores:5,
            frecuency:1200,
            socket:'ax2',
            watts: 100
        }

        const req = {
            body: { ...product, ...disk }
        } as unknown as Request

        await controller.create(req, res, next)

        expect(next).toHaveBeenCalledTimes(1)
    });

    it('should upload file and give product an image, then create processor', async () => {
        const product: IProductCreate = {
            description: 'test-description',
            id_brand: 1,
            id_category: 1,
            image: null,
            name: 'test-name',
            price: 120,
            stock: true
        }

        const processor: IProcessorCreate = {
            cores:5,
            frecuency:2500,
            socket:'ax3',
            watts: 200
        }

        const req = {
            body: { ...product, ...processor },
            file: mockFile
        } as unknown as Request

        await controller.create(req, res, next)
        expect(imageUpload.uploadProduct).toHaveBeenCalledWith(req.file)
    });

    it('should delete uploaded image if error is thrown', async () => {
        const product: IProductCreate = {
            description: 'test-description',
            id_brand: 1,
            id_category: 1,
            image: null,
            name: 'test-name',
            price: 120,
            stock: true
        }

        const processor: IProcessorCreate = {
            cores:1,
            frecuency:250,
            socket:'ax0',
            watts: 40,
        }

        const req = {
            body: { ...product, ...processor },
            file: mockFile
        } as unknown as Request
        const uploadProductResponse = { Location: 'test-location' }
        imageUpload.uploadProduct.mockImplementationOnce(() => Promise.resolve(uploadProductResponse))
        processorService.create.mockImplementationOnce(() => Promise.reject(TEST_ERROR))
        await controller.create(req, res, next)
        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith(TEST_ERROR)
        expect(imageUpload.deleteProduct).toHaveBeenCalledTimes(1)
        expect(imageUpload.deleteProduct).toHaveBeenCalledWith(uploadProductResponse.Location)
    });
});

describe('edit', () => {
    it('should edit processor', async () => {
        const processor: IProcessorEdit = { watts: 500 }
        const PROCESSOR_ID = '5'
        const req = {
            body: processor,
            params: { id: PROCESSOR_ID }
        } as unknown as Request
        await controller.edit(req, res, next)
        expect(processorService.modify).toHaveBeenCalledTimes(1)
        const PROCESSOR_ID_TO_NUMBER = Number(PROCESSOR_ID)
        expect(processorService.modify).toHaveBeenCalledWith(PROCESSOR_ID_TO_NUMBER, processor)
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
    });
    it('should call next function if validation error occurs', async () => {
        const INVALID_PROCESSOR_CPU_BRAND = 'invalid-cpu-brand'
        const processor = { type: INVALID_PROCESSOR_CPU_BRAND } as unknown as IProcessorEdit
        const PROCESSOR_ID = '5'
        const req = {
            body: processor,
            params: { id: PROCESSOR_ID }
        } as unknown as Request
        await controller.edit(req, res, next)
        expect(next).toHaveBeenCalledTimes(1)
    });
});

describe('delete', () => {
    it('should delete processor successfully ', async () => {
        const PROCESSOR_ID = '5'
        const PROCESSOR_ID_TO_NUMBER = Number(PROCESSOR_ID)

        const req = {
            params: { id: PROCESSOR_ID }
        } as unknown as Request
        processorService.delete.mockImplementationOnce(() => Promise.resolve(true))
        await controller.delete(req, res, next)
        expect(processorService.delete).toHaveBeenCalledWith(PROCESSOR_ID_TO_NUMBER)
        expect(res.status).toHaveBeenCalledWith(StatusCodes.NO_CONTENT)
    });

    it('should call next function if error was thrown', async () => {
        const DISK_ID = 5
        const req = {
            params: { id: DISK_ID }
        } as unknown as Request
        processorService.delete.mockImplementationOnce(() => Promise.reject(TEST_ERROR))
        await controller.delete(req, res, next)
        expect(next).toHaveBeenCalledTimes(1)
    });
});