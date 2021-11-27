import { Multer } from 'multer';
import 'reflect-metadata'
import { CabinetController } from '../CabinetController';
import { application, Request, Response } from 'express'
import { mocked } from 'ts-jest/utils';
import { GetCabinetsReqDto } from '../../dto/getCabinetsReqDto';
import { ICabinetProductless } from '../../interface/ICabinetCreate';
import { IProductCreate } from '../../../../product/interfaces/IProductCreate';
import { ICabinetEdit } from '../../interface/ICabinetEdit';
import { StatusCodes } from 'http-status-codes';
jest.mock('express')
const app = mocked(application, true)

const cabinetService = {
    createCabinet: jest.fn(),
    deleteCabinet: jest.fn(),
    getCabinets: jest.fn(),
    getSingleCabinet: jest.fn(),
    modifyCabinet: jest.fn()
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
    uploadProduct: jest.fn()
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

const TEST_ERROR = Error('test-error')

let controller: CabinetController

beforeEach(() => {
    controller = new CabinetController(cabinetService, uploadMiddleware, imageUpload)
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
    const QUERY_PARAMS: GetCabinetsReqDto = { limit: 10, offset: 0 }
    const req = {
        query: QUERY_PARAMS
    } as unknown as Request

    it('should work correctly ', async () => {
        await controller.getAll(req, res, next)
        expect(cabinetService.getCabinets).toHaveBeenCalledWith(QUERY_PARAMS)
        expect(res.send).toHaveBeenCalledTimes(1)
        expect(res.send).toHaveBeenCalledWith(undefined)
        expect(res.status).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledWith(200)
    });

    it('should call next function if error is thrown', async () => {
        cabinetService.getCabinets.mockImplementationOnce(() => Promise.reject(TEST_ERROR))
        await controller.getAll(req, res, next)
        expect(next).toHaveBeenCalledWith(TEST_ERROR)
    });
});

describe('getSingleCabinet', () => {
    const ID_PARAM = 5
    const req = {
        params: {
            id: ID_PARAM
        }
    } as unknown as Request

    it('should work correctly ', async () => {
        await controller.getSingleCabinet(req, res, next)
        expect(cabinetService.getSingleCabinet).toHaveBeenCalledWith(ID_PARAM)
        expect(res.send).toHaveBeenCalledTimes(1)
        expect(res.send).toHaveBeenCalledWith(undefined)
        expect(res.status).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledWith(200)
    });
    it('should call next function if error is thrown ', async () => {
        cabinetService.getSingleCabinet.mockImplementationOnce(() => Promise.reject(TEST_ERROR))
        await controller.getSingleCabinet(req, res, next)
        expect(next).toHaveBeenCalledWith(TEST_ERROR)
    });
});

describe('create', () => {


    it('should create a cabinet', async () => {

        const product: IProductCreate = {
            description: 'test-description',
            id_brand: 1,
            id_category: 1,
            image: null,
            name: 'test-name',
            price: 120,
            stock: true
        }

        const cabinet: ICabinetProductless = {
            generic_pws: true,
            size: 'ATX'
        }

        const req = {
            body: { ...product, ...cabinet }
        } as unknown as Request

        await controller.create(req, res, next)
        expect(cabinetService.createCabinet).toHaveBeenCalledWith(product, cabinet)
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

        const cabinet: ICabinetProductless = {
            generic_pws: true,
            size: 'ATX'
        }

        const req = {
            body: { ...product, ...cabinet }
        } as unknown as Request

        await controller.create(req, res, next)

        expect(next).toHaveBeenCalledTimes(1)
    });

    it('should upload file and give product an image, then create cabinet', async () => {
        const product: IProductCreate = {
            description: 'test-description',
            id_brand: 1,
            id_category: 1,
            image: null,
            name: 'test-name',
            price: 120,
            stock: true
        }

        const cabinet: ICabinetProductless = {
            generic_pws: true,
            size: 'ATX'
        }

        const req = {
            body: { ...product, ...cabinet },
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

        const cabinet: ICabinetProductless = {
            generic_pws: true,
            size: 'ATX'
        }

        const req = {
            body: { ...product, ...cabinet },
            file: mockFile
        } as unknown as Request
        const uploadProductResponse = { Location: 'test-location' }
        imageUpload.uploadProduct.mockImplementationOnce(() => Promise.resolve(uploadProductResponse))
        cabinetService.createCabinet.mockImplementationOnce(() => Promise.reject(TEST_ERROR))
        await controller.create(req, res, next)
        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith(TEST_ERROR)
        expect(imageUpload.deleteProduct).toHaveBeenCalledTimes(1)
        expect(imageUpload.deleteProduct).toHaveBeenCalledWith(uploadProductResponse.Location)
    });
});

describe('edit', () => {
    it('should edit cabinet', async () => {
        const CABINET: ICabinetEdit = { generic_pws: false }
        const CABINET_ID = 5
        const req = {
            body: CABINET,
            params: { id: CABINET_ID }
        } as unknown as Request
        await controller.edit(req, res, next)
        expect(cabinetService.modifyCabinet).toHaveBeenCalledTimes(1)
        expect(cabinetService.modifyCabinet).toHaveBeenCalledWith(CABINET_ID, CABINET)
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
    });
    it('should call next function if validation error occurs', async () => {
        const INVALID_CABINET_PWS = 'invalid-pws'
        const CABINET = { generic_pws: INVALID_CABINET_PWS }
        const CABINET_ID = 5
        const req = {
            body: CABINET,
            params: { id: CABINET_ID }
        } as unknown as Request
        await controller.edit(req, res, next)
        expect(next).toHaveBeenCalledTimes(1)
    });
});

describe('delete', () => {
    it('should delete an cabinet successfully ', async () => {
        const CABINET_ID = 5
        const req = {
            params: { id: CABINET_ID }
        } as unknown as Request
        await controller.delete(req, res, next)
        expect(cabinetService.deleteCabinet).toHaveBeenCalledWith(CABINET_ID)
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
    });

    it('should call next function if error was thrown', async () => {
        const CABINET_ID = 5
        const req = {
            params: { id: CABINET_ID }
        } as unknown as Request
        cabinetService.deleteCabinet.mockImplementationOnce(() => Promise.reject(TEST_ERROR))
        await controller.delete(req, res, next)
        expect(next).toHaveBeenCalledWith(TEST_ERROR)
    });


});