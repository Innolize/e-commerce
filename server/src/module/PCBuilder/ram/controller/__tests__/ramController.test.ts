import 'reflect-metadata'
import { application, Request, Response } from 'express'
import { mocked } from 'ts-jest/utils'
import { Multer } from 'multer'
import { IProductService } from '../../../../product/interfaces/IProductService'
import { RamController } from '../ramController'
import { StatusCodes } from 'http-status-codes'
import { IRamEdit } from '../../interface/IRamEdit'
import { IRamCreate } from '../../interface/IRamCreate'
import { IProductCreate } from '../../../../product/interfaces/IProductCreate'
import { GetRamReqDto } from '../../dto/getRamReqDto'
import { fromRequestToRamCreate } from '../../mapper/ramMapper'

jest.mock('express')
const app = mocked(application, true)

const ramService = {
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

let controller: RamController

beforeEach(() => {
    controller = new RamController(ramService, uploadMiddleware, imageUpload, productService)
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
    const QUERY_PARAMS: GetRamReqDto = { limit: 10, offset: 0 }
    const req = {
        query: QUERY_PARAMS
    } as unknown as Request

    it('should work correctly ', async () => {
        await controller.getAll(req, res, next)
        expect(ramService.getAll).toHaveBeenCalledWith(QUERY_PARAMS)
        expect(res.send).toHaveBeenCalledTimes(1)
        expect(res.send).toHaveBeenCalledWith(undefined)
        expect(res.status).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledWith(200)
    });

    it('should call next function if error is thrown', async () => {
        ramService.getAll.mockImplementationOnce(() => Promise.reject(TEST_ERROR))
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
        expect(ramService.getSingle).toHaveBeenCalledWith(ID_PARAM)
        expect(res.send).toHaveBeenCalledTimes(1)
        expect(res.send).toHaveBeenCalledWith(undefined)
        expect(res.status).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledWith(200)
    });
    it('should call next function if error is thrown ', async () => {
        ramService.getSingle.mockImplementationOnce(() => Promise.reject(TEST_ERROR))
        await controller.getSingle(req, res, next)
        expect(next).toHaveBeenCalledWith(TEST_ERROR)
    });
});

describe('create', () => {


    it('should create a ram', async () => {

        const product: IProductCreate = {
            description: 'test-description',
            id_brand: 1,
            id_category: 6,
            image: null,
            name: 'test-name',
            price: 120,
            stock: true
        }
        const ram: IRamCreate = {
            max_frec: 2000,
            memory: 8000,
            min_frec: 1000,
            ram_version:'DDR2',
            watts: 40,
        }

        const req = {
            body: { ...product, ...ram }
        } as unknown as Request
        const newMotherboard = fromRequestToRamCreate({ ...ram, product })

        await controller.create(req, res, next)
        expect(ramService.create).toHaveBeenCalledWith(newMotherboard)
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

        const ram: IRamCreate = {
            max_frec:2000,
            memory:4000,
            min_frec:1000,
            ram_version:'DDR3',
            watts: 100
        }

        const req = {
            body: { ...product, ...ram }
        } as unknown as Request

        await controller.create(req, res, next)

        expect(next).toHaveBeenCalledTimes(1)
    });

    it('should upload file and give product an image, then create ram', async () => {
        const product: IProductCreate = {
            description: 'test-description',
            id_brand: 1,
            id_category: 1,
            image: null,
            name: 'test-name',
            price: 120,
            stock: true
        }

        const ram: IRamCreate = {
            max_frec:4000,
            memory:2000,
            min_frec:3000,
            ram_version:'DDR3',
            watts: 200
        }

        const req = {
            body: { ...product, ...ram },
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

        const ram: IRamCreate = {
            max_frec:2000,
            memory:1500,
            min_frec:1000,
            ram_version:'DDR4',
            watts: 40,
        }

        const req = {
            body: { ...product, ...ram },
            file: mockFile
        } as unknown as Request
        const uploadProductResponse = { Location: 'test-location' }
        imageUpload.uploadProduct.mockImplementationOnce(() => Promise.resolve(uploadProductResponse))
        ramService.create.mockImplementationOnce(() => Promise.reject(TEST_ERROR))
        await controller.create(req, res, next)
        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith(TEST_ERROR)
        expect(imageUpload.deleteProduct).toHaveBeenCalledTimes(1)
        expect(imageUpload.deleteProduct).toHaveBeenCalledWith(uploadProductResponse.Location)
    });
});

describe('edit', () => {
    it('should edit ram', async () => {
        const ram: IRamEdit = { watts: 500 }
        const RAM_ID = '5'
        const req = {
            body: ram,
            params: { id: RAM_ID }
        } as unknown as Request
        await controller.edit(req, res, next)
        expect(ramService.modify).toHaveBeenCalledTimes(1)
        const RAM_ID_TO_NUMBER = Number(RAM_ID)
        expect(ramService.modify).toHaveBeenCalledWith(RAM_ID_TO_NUMBER, ram)
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
    });
    it('should call next function if validation error occurs', async () => {
        const INVALID_RAM_CPU_BRAND = 'invalid-cpu-brand'
        const ram = { type: INVALID_RAM_CPU_BRAND } as unknown as IRamEdit
        const RAM_ID = '5'
        const req = {
            body: ram,
            params: { id: RAM_ID }
        } as unknown as Request
        await controller.edit(req, res, next)
        expect(next).toHaveBeenCalledTimes(1)
    });
});

describe('delete', () => {
    it('should delete ram successfully ', async () => {
        const RAM_ID = '5'
        const RAM_ID_TO_NUMBER = Number(RAM_ID)

        const req = {
            params: { id: RAM_ID }
        } as unknown as Request
        ramService.delete.mockImplementationOnce(() => Promise.resolve(true))
        await controller.delete(req, res, next)
        expect(ramService.delete).toHaveBeenCalledWith(RAM_ID_TO_NUMBER)
        expect(res.status).toHaveBeenCalledWith(StatusCodes.NO_CONTENT)
    });

    it('should call next function if error was thrown', async () => {
        const DISK_ID = 5
        const req = {
            params: { id: DISK_ID }
        } as unknown as Request
        ramService.delete.mockImplementationOnce(() => Promise.reject(TEST_ERROR))
        await controller.delete(req, res, next)
        expect(next).toHaveBeenCalledTimes(1)
    });
});