import 'reflect-metadata'
import { application, Request, Response } from 'express'
import { Multer } from 'multer'
import { mocked } from "ts-jest/utils"
import { DiskStorageController } from '../DiskStorageController'
import { IProductService } from '../../../../product/interfaces/IProductService'
import { GetDiskStorageReqDto } from '../../dto/getDiskStorageReqDto'
import { IProductCreate } from '../../../../product/interfaces/IProductCreate'
import { IDiskStorageCreate } from '../../interface/IDiskStorageCreate'
import { IDiskStorageEdit } from '../../interface/IDiskStorageEdit'
import { StatusCodes } from 'http-status-codes'
import { fromRequestToDiskStorageCreate } from '../../mapper/diskStorageMapper'

jest.mock('express')
const app = mocked(application, true)

const diskStorageService = {
    createDisk: jest.fn(),
    deleteDisk: jest.fn(),
    getDisks: jest.fn(),
    getSingleDisk: jest.fn(),
    modifyDisk: jest.fn()
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

const TEST_ERROR = Error('test-error')

let controller: DiskStorageController

beforeEach(() => {
    controller = new DiskStorageController(diskStorageService, uploadMiddleware, imageUpload, productService)
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
    const QUERY_PARAMS: GetDiskStorageReqDto = { limit: 10, offset: 0 }
    const req = {
        query: QUERY_PARAMS
    } as unknown as Request

    it('should work correctly ', async () => {
        await controller.getAll(req, res, next)
        expect(diskStorageService.getDisks).toHaveBeenCalledWith(QUERY_PARAMS)
        expect(res.send).toHaveBeenCalledTimes(1)
        expect(res.send).toHaveBeenCalledWith(undefined)
        expect(res.status).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledWith(200)
    });

    it('should call next function if error is thrown', async () => {
        diskStorageService.getDisks.mockImplementationOnce(() => Promise.reject(TEST_ERROR))
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
        await controller.getSingleDisk(req, res, next)
        expect(diskStorageService.getSingleDisk).toHaveBeenCalledWith(ID_PARAM)
        expect(res.send).toHaveBeenCalledTimes(1)
        expect(res.send).toHaveBeenCalledWith(undefined)
        expect(res.status).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledWith(200)
    });
    it('should call next function if error is thrown ', async () => {
        diskStorageService.getSingleDisk.mockImplementationOnce(() => Promise.reject(TEST_ERROR))
        await controller.getSingleDisk(req, res, next)
        expect(next).toHaveBeenCalledWith(TEST_ERROR)
    });
});

describe('create', () => {


    it('should create a disk', async () => {

        const product: IProductCreate = {
            description: 'test-description',
            id_brand: 1,
            id_category: 1,
            image: null,
            name: 'test-name',
            price: 120,
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
        const test = fromRequestToDiskStorageCreate({ ...disk, product })

        await controller.create(req, res, next)
        expect(diskStorageService.createDisk).toHaveBeenCalledWith(test)
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

    it('should upload file and give product an image, then create disk', async () => {
        const product: IProductCreate = {
            description: 'test-description',
            id_brand: 1,
            id_category: 1,
            image: null,
            name: 'test-name',
            price: 120,
            stock: true
        }

        const disk: IDiskStorageCreate = {
            mbs: 500,
            total_storage: 1024,
            type: 'HDD',
            watts: 40,
        }

        const req = {
            body: { ...product, ...disk },
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

        const disk: IDiskStorageCreate = {
            mbs: 500,
            total_storage: 1024,
            type: 'HDD',
            watts: 40,
        }

        const req = {
            body: { ...product, ...disk },
            file: mockFile
        } as unknown as Request
        const uploadProductResponse = { Location: 'test-location' }
        imageUpload.uploadProduct.mockImplementationOnce(() => Promise.resolve(uploadProductResponse))
        diskStorageService.createDisk.mockImplementationOnce(() => Promise.reject(TEST_ERROR))
        await controller.create(req, res, next)
        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith(TEST_ERROR)
        expect(imageUpload.deleteProduct).toHaveBeenCalledTimes(1)
        expect(imageUpload.deleteProduct).toHaveBeenCalledWith(uploadProductResponse.Location)
    });
});

describe('edit', () => {
    it('should edit cabinet', async () => {
        const disk: IDiskStorageEdit = { watts: 500 }
        const DISK_ID = 5
        const req = {
            body: disk,
            params: { id: DISK_ID }
        } as unknown as Request
        await controller.edit(req, res, next)
        expect(diskStorageService.modifyDisk).toHaveBeenCalledTimes(1)
        expect(diskStorageService.modifyDisk).toHaveBeenCalledWith(DISK_ID, disk)
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
    });
    it('should call next function if validation error occurs', async () => {
        const INVALID_CABINET_PWS = 'invalid-pws'
        const DISK = { type: INVALID_CABINET_PWS } as unknown as IDiskStorageEdit
        const DISK_ID = 5
        const req = {
            body: DISK,
            params: { id: DISK_ID }
        } as unknown as Request
        await controller.edit(req, res, next)
        expect(next).toHaveBeenCalledTimes(1)
    });
});

describe('delete', () => {
    it('should delete disk successfully ', async () => {
        const DISK_ID = 5
        const req = {
            params: { id: DISK_ID }
        } as unknown as Request
        await controller.delete(req, res, next)
        expect(diskStorageService.deleteDisk).toHaveBeenCalledWith(DISK_ID)
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
    });

    it('should call next function if error was thrown', async () => {
        const DISK_ID = 5
        const req = {
            params: { id: DISK_ID }
        } as unknown as Request
        diskStorageService.deleteDisk.mockImplementationOnce(() => Promise.reject(TEST_ERROR))
        await controller.delete(req, res, next)
        expect(next).toHaveBeenCalledWith(TEST_ERROR)
    });


});