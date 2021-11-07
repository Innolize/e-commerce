import 'reflect-metadata'
import { application, Request, Response } from 'express'
import { mocked } from 'ts-jest/utils'
import { Multer } from 'multer'
import { IProductService } from '../../../../product/interfaces/IProductService'
import { PowerSupplyController } from '../PowerSupplyController'
import { StatusCodes } from 'http-status-codes'
import { IPowerSupplyEdit } from '../../interface/IPowerSupplyEdit'
import { IPowerSupplyCreate } from '../../interface/IPowerSupplyCreate'
import { IProductCreate } from '../../../../product/interfaces/IProductCreate'
import { GetPowerSupplyReqDto } from '../../dto/getPowerSupplyReqDto'
import { fromRequestToPowerSupplyCreate } from '../../mapper/powerSupplyMapper'

jest.mock('express')
const app = mocked(application, true)

const powerSupplyService = {
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

let controller: PowerSupplyController

beforeEach(() => {
    controller = new PowerSupplyController(powerSupplyService, uploadMiddleware, imageUpload, productService)
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
    const QUERY_PARAMS: GetPowerSupplyReqDto = { limit: 10, offset: 0 }
    const req = {
        query: QUERY_PARAMS
    } as unknown as Request

    it('should work correctly ', async () => {
        await controller.getAll(req, res, next)
        expect(powerSupplyService.getAll).toHaveBeenCalledWith(QUERY_PARAMS)
        expect(res.send).toHaveBeenCalledTimes(1)
        expect(res.send).toHaveBeenCalledWith(undefined)
        expect(res.status).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledWith(200)
    });

    it('should call next function if error is thrown', async () => {
        powerSupplyService.getAll.mockImplementationOnce(() => Promise.reject(TEST_ERROR))
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
        expect(powerSupplyService.getSingle).toHaveBeenCalledWith(ID_PARAM)
        expect(res.send).toHaveBeenCalledTimes(1)
        expect(res.send).toHaveBeenCalledWith(undefined)
        expect(res.status).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledWith(200)
    });
    it('should call next function if error is thrown ', async () => {
        powerSupplyService.getSingle.mockImplementationOnce(() => Promise.reject(TEST_ERROR))
        await controller.getSingle(req, res, next)
        expect(next).toHaveBeenCalledWith(TEST_ERROR)
    });
});

describe('create', () => {


    it('should create a powerSupply', async () => {

        const product: IProductCreate = {
            description: 'test-description',
            id_brand: 1,
            id_category: 4,
            image: null,
            name: 'test-name',
            price: 120,
            stock: true
        }
        const powerSupply: IPowerSupplyCreate = {
            certification: 'GENERIC',
            watts: 40,
        }

        const req = {
            body: { ...product, ...powerSupply }
        } as unknown as Request
        const newMotherboard = fromRequestToPowerSupplyCreate({ ...powerSupply, product })

        await controller.create(req, res, next)
        expect(powerSupplyService.create).toHaveBeenCalledWith(newMotherboard)
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

        const disk: IPowerSupplyCreate = {
            certification: 'GENERIC',
            watts: 100
        }

        const req = {
            body: { ...product, ...disk }
        } as unknown as Request

        await controller.create(req, res, next)

        expect(next).toHaveBeenCalledTimes(1)
    });

    it('should upload file and give product an image, then create powerSupply', async () => {
        const product: IProductCreate = {
            description: 'test-description',
            id_brand: 1,
            id_category: 1,
            image: null,
            name: 'test-name',
            price: 120,
            stock: true
        }

        const powerSupply: IPowerSupplyCreate = {
            certification: 'PLUS',
            watts: 200
        }

        const req = {
            body: { ...product, ...powerSupply },
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

        const powerSupply: IPowerSupplyCreate = {
            certification: 'PLUS SILVER',
            watts: 40,
        }

        const req = {
            body: { ...product, ...powerSupply },
            file: mockFile
        } as unknown as Request
        const uploadProductResponse = { Location: 'test-location' }
        imageUpload.uploadProduct.mockImplementationOnce(() => Promise.resolve(uploadProductResponse))
        powerSupplyService.create.mockImplementationOnce(() => Promise.reject(TEST_ERROR))
        await controller.create(req, res, next)
        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith(TEST_ERROR)
        expect(imageUpload.deleteProduct).toHaveBeenCalledTimes(1)
        expect(imageUpload.deleteProduct).toHaveBeenCalledWith(uploadProductResponse.Location)
    });
});

describe('edit', () => {
    it('should edit powerSupply', async () => {
        const powerSupply: IPowerSupplyEdit = { watts: 500 }
        const POWER_SUPPLY_ID = '5'
        const req = {
            body: powerSupply,
            params: { id: POWER_SUPPLY_ID }
        } as unknown as Request
        await controller.edit(req, res, next)
        expect(powerSupplyService.modify).toHaveBeenCalledTimes(1)
        const POWER_SUPPLY_ID_TO_NUMBER = Number(POWER_SUPPLY_ID)
        expect(powerSupplyService.modify).toHaveBeenCalledWith(POWER_SUPPLY_ID_TO_NUMBER, powerSupply)
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
    });
    it('should call next function if validation error occurs', async () => {
        const INVALID_POWER_SUPPLY_CPU_BRAND = 'invalid-cpu-brand'
        const powerSupply = { type: INVALID_POWER_SUPPLY_CPU_BRAND } as unknown as IPowerSupplyEdit
        const POWER_SUPPLY_ID = '5'
        const req = {
            body: powerSupply,
            params: { id: POWER_SUPPLY_ID }
        } as unknown as Request
        await controller.edit(req, res, next)
        expect(next).toHaveBeenCalledTimes(1)
    });
});

describe('delete', () => {
    it('should delete powerSupply successfully ', async () => {
        const POWER_SUPPLY_ID = '5'
        const POWER_SUPPLY_ID_TO_NUMBER = Number(POWER_SUPPLY_ID)

        const req = {
            params: { id: POWER_SUPPLY_ID }
        } as unknown as Request
        powerSupplyService.delete.mockImplementationOnce(() => Promise.resolve(true))
        await controller.delete(req, res, next)
        expect(powerSupplyService.delete).toHaveBeenCalledWith(POWER_SUPPLY_ID_TO_NUMBER)
        expect(res.status).toHaveBeenCalledWith(StatusCodes.NO_CONTENT)
    });

    it('should call next function if error was thrown', async () => {
        const DISK_ID = 5
        const req = {
            params: { id: DISK_ID }
        } as unknown as Request
        powerSupplyService.delete.mockImplementationOnce(() => Promise.reject(TEST_ERROR))
        await controller.delete(req, res, next)
        expect(next).toHaveBeenCalledTimes(1)
    });
});