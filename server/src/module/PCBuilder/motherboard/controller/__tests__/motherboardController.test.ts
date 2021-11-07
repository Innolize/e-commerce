import 'reflect-metadata'
import { application, Request, Response } from 'express'
import { mocked } from 'ts-jest/utils'
import { Multer } from 'multer'
import { IProductService } from '../../../../product/interfaces/IProductService'
import { MotherboardController } from '../motherboardController'
import { GetMotherboardReqDto } from '../../dto/getMotherboardsReqDto'
import { IProductCreate } from '../../../../product/interfaces/IProductCreate'
import { IDiskStorageCreate } from '../../../disk-storage/interface/IDiskStorageCreate'
import { IMotherboardCreate } from '../../interface/IMotherboardCreate'
import { fromRequestToMotherboardCreate } from '../../mapper/motherboardMapper'
import { IMotherboardEdit } from '../../interface/IMotherboardEdit'
import { StatusCodes } from 'http-status-codes'

jest.mock('express')
const app = mocked(application, true)

const motherboardService = {
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

let controller: MotherboardController

beforeEach(() => {
    controller = new MotherboardController(motherboardService, uploadMiddleware, imageUpload, productService)
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
    const QUERY_PARAMS: GetMotherboardReqDto = { limit: 10, offset: 0 }
    const req = {
        query: QUERY_PARAMS
    } as unknown as Request

    it('should work correctly ', async () => {
        await controller.getAll(req, res, next)
        expect(motherboardService.getAll).toHaveBeenCalledWith(QUERY_PARAMS)
        expect(res.send).toHaveBeenCalledTimes(1)
        expect(res.send).toHaveBeenCalledWith(undefined)
        expect(res.status).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledWith(200)
    });

    it('should call next function if error is thrown', async () => {
        motherboardService.getAll.mockImplementationOnce(() => Promise.reject(TEST_ERROR))
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
        expect(motherboardService.getSingle).toHaveBeenCalledWith(ID_PARAM)
        expect(res.send).toHaveBeenCalledTimes(1)
        expect(res.send).toHaveBeenCalledWith(undefined)
        expect(res.status).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledWith(200)
    });
    it('should call next function if error is thrown ', async () => {
        motherboardService.getSingle.mockImplementationOnce(() => Promise.reject(TEST_ERROR))
        await controller.getSingle(req, res, next)
        expect(next).toHaveBeenCalledWith(TEST_ERROR)
    });
});

describe('create', () => {


    it('should create a motherboard', async () => {

        const product: IProductCreate = {
            description: 'test-description',
            id_brand: 1,
            id_category: 3,
            image: null,
            name: 'test-name',
            price: 120,
            stock: true
        }
        const motherboard: IMotherboardCreate = {
            cpu_brand: 'AMD',
            cpu_socket: 'cpu-socket',
            max_frec: 2000,
            min_frec: 1000,
            model_size: 'ATX',
            ram_version: 'DDR1',
            video_socket: 'DDR4',
            watts: 40,
        }

        const req = {
            body: { ...product, ...motherboard }
        } as unknown as Request
        const newMotherboard = fromRequestToMotherboardCreate({ ...motherboard, product })

        await controller.create(req, res, next)
        expect(motherboardService.create).toHaveBeenCalledWith(newMotherboard)
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

        const disk: IDiskStorageCreate = {
            mbs: 500,
            total_storage: 1024,
            type: 'HDD',
            watts: 40,
        }

        const req = {
            body: { ...product, ...disk }
        } as unknown as Request

        await controller.create(req, res, next)

        expect(next).toHaveBeenCalledTimes(1)
    });

    it('should upload file and give product an image, then create motherboard', async () => {
        const product: IProductCreate = {
            description: 'test-description',
            id_brand: 1,
            id_category: 1,
            image: null,
            name: 'test-name',
            price: 120,
            stock: true
        }

        const motherboard: IMotherboardCreate = {
            cpu_brand: 'AMD',
            cpu_socket: 'ax1',
            max_frec: 2000,
            min_frec: 1000,
            model_size: 'ATX',
            ram_version: 'DDR4',
            video_socket: 'DDR4',
            watts: 40,
        }

        const req = {
            body: { ...product, ...motherboard },
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

        const motherboard: IMotherboardCreate = {
            cpu_brand: 'AMD',
            cpu_socket: 'ax1',
            max_frec: 2000,
            min_frec: 1000,
            model_size: 'ATX',
            ram_version: 'DDR4',
            video_socket: 'DDR4',
            watts: 40,
        }

        const req = {
            body: { ...product, ...motherboard },
            file: mockFile
        } as unknown as Request
        const uploadProductResponse = { Location: 'test-location' }
        imageUpload.uploadProduct.mockImplementationOnce(() => Promise.resolve(uploadProductResponse))
        motherboardService.create.mockImplementationOnce(() => Promise.reject(TEST_ERROR))
        await controller.create(req, res, next)
        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith(TEST_ERROR)
        expect(imageUpload.deleteProduct).toHaveBeenCalledTimes(1)
        expect(imageUpload.deleteProduct).toHaveBeenCalledWith(uploadProductResponse.Location)
    });
});

describe('edit', () => {
    it('should edit motherboard', async () => {
        const motherboard: IMotherboardEdit = { watts: 500 }
        const MOTHERBOARD_ID = '5'
        const req = {
            body: motherboard,
            params: { id: MOTHERBOARD_ID }
        } as unknown as Request
        await controller.edit(req, res, next)
        expect(motherboardService.modify).toHaveBeenCalledTimes(1)
        const MOTHERBOARD_ID_TO_NUMBER = Number(MOTHERBOARD_ID)
        expect(motherboardService.modify).toHaveBeenCalledWith(MOTHERBOARD_ID_TO_NUMBER, motherboard)
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
    });
    it('should call next function if validation error occurs', async () => {
        const INVALID_MOTHERBOARD_CPU_BRAND = 'invalid-cpu-brand'
        const motherboard = { type: INVALID_MOTHERBOARD_CPU_BRAND } as unknown as IMotherboardEdit
        const MOTHERBOARD_ID = '5'
        const req = {
            body: motherboard,
            params: { id: MOTHERBOARD_ID }
        } as unknown as Request
        await controller.edit(req, res, next)
        expect(next).toHaveBeenCalledTimes(1)
    });
});

describe('delete', () => {
    it('should delete motherboard successfully ', async () => {
        const MOTHERBOARD_ID = '5'
        const MOTHERBOARD_ID_TO_NUMBER = Number(MOTHERBOARD_ID)

        const req = {
            params: { id: MOTHERBOARD_ID }
        } as unknown as Request
        motherboardService.delete.mockImplementationOnce(() => Promise.resolve(true))
        await controller.delete(req, res, next)
        expect(motherboardService.delete).toHaveBeenCalledWith(MOTHERBOARD_ID_TO_NUMBER)
        expect(res.status).toHaveBeenCalledWith(StatusCodes.NO_CONTENT)
    });

    it('should call next function if error was thrown', async () => {
        const DISK_ID = 5
        const req = {
            params: { id: DISK_ID }
        } as unknown as Request
        motherboardService.delete.mockImplementationOnce(() => Promise.reject(TEST_ERROR))
        await controller.delete(req, res, next)
        expect(next).toHaveBeenCalledTimes(1)
    });
});