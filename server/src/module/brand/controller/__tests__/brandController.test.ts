import 'reflect-metadata'
import { Multer } from "multer";
import { BrandController } from "../brandController";
import { mocked } from 'ts-jest/utils';
import { application, NextFunction, Request, Response } from 'express';
import { Brand } from '../../entity/Brand';
import { IBrandEdit } from '../../interfaces/IBrandEdit';
jest.mock('express')
let controller: BrandController

const service = {
    createBrand: jest.fn(),
    deleteBrand: jest.fn(),
    findBrandById: jest.fn(),
    getAllBrands: jest.fn(),
    modifyBrand: jest.fn()
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

const app = mocked(application, true)

const next: NextFunction = jest.fn()

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
    size: 118057
}

const MOCK_ERROR = new Error('MOCK-ERROR')


beforeAll(() => {
    controller = new BrandController(service, uploadMiddleware, imageUpload)
});

afterEach(() => {
    jest.clearAllMocks()
});

describe('configureRoutes', () => {
    it('should configure app correctly', () => {
        controller.configureRoutes(app);
        expect(app.get).toHaveBeenCalledTimes(2);
        expect(app.post).toHaveBeenCalledTimes(1);
        expect(app.put).toHaveBeenCalledTimes(1);
        expect(app.delete).toHaveBeenCalledTimes(1);
    });
});

describe('getAllBrands', () => {
    it('should retrieve brands', async () => {
        const queryParams = {
            limit: '5',
            offset: '0',
            name: 'name-test'
        }
        const req = {
            query: queryParams
        } as Partial<Request> as Request

        const EXPECTED_PARAMS: IBrandGetAllQueries = {
            limit: 5,
            offset: 0,
            name: 'name-test'
        }

        await controller.getAllBrands(req, res, next)

        expect(service.getAllBrands).toHaveBeenCalledTimes(1)
        expect(service.getAllBrands).toHaveBeenCalledWith(EXPECTED_PARAMS)
    });

    it('should call next function if error is thrown', async () => {
        const INVALID_LIMIT = 'invalid-limit'
        const INVALID_OFFSET = 'invalid-offset'
        const NAME_TEST = 'name-test'
        const queryParams = {
            limit: INVALID_LIMIT,
            offset: INVALID_OFFSET,
            name: NAME_TEST
        }
        const req = {
            query: queryParams
        } as Partial<Request> as Request

        await controller.getAllBrands(req, res, next)
        expect(next).toHaveBeenCalledTimes(1)
    });
});

describe('createBrand', () => {
    it('should create a new brand', async () => {
        const newBrand = {
            name: 'test-brand'
        }
        const req = {
            body: newBrand,
            file: undefined
        } as Partial<Request> as Request

        const EXPECTED_BRAND = new Brand('test-brand', null, undefined)

        await controller.createBrand(req, res, next)

        expect(service.createBrand).toHaveBeenCalledTimes(1)
        expect(service.createBrand).toHaveBeenCalledWith(EXPECTED_BRAND)
    });

    it('should create a brand with logo', async () => {
        const newBrand = {
            name: 'test-brand'
        }
        const uploadBrandResponseMock = { Location: 'www.test-url.com' }
        imageUpload.uploadBrand.mockImplementationOnce(() => Promise.resolve(uploadBrandResponseMock))

        const req = {
            body: newBrand,
            file: mockFile
        } as Partial<Request> as Request

        await controller.createBrand(req, res, next)

        expect(service.createBrand).toHaveBeenCalledTimes(1)
        expect(service.createBrand).toHaveBeenCalledWith({ name: 'test-brand', logo: uploadBrandResponseMock.Location, undefined })
    });

    it('should call next function if error is thrown', async () => {
        const newBrand = {
            name: 'test-brand'
        }

        const req = {
            body: newBrand
        } as Partial<Request> as Request

        service.createBrand.mockImplementationOnce(() => Promise.reject(MOCK_ERROR))

        await controller.createBrand(req, res, next)
        expect(imageUpload.deleteBrand).toHaveBeenCalledTimes(0)
        expect(next).toHaveBeenCalledTimes(1)
    });

    it('should call next function if error is thrown and delete current uploaded logo ', async () => {
        const newBrand = {
            name: 'test-brand'
        }
        const req = {
            body: newBrand,
            file: mockFile
        } as Partial<Request> as Request

        const MOCK_ERROR = new Error('MOCK-ERROR')

        service.createBrand.mockImplementationOnce(() => Promise.reject(MOCK_ERROR))
        const uploadBrandResponseMock = { Location: 'www.test-url.com' }
        imageUpload.uploadBrand.mockImplementationOnce(() => Promise.resolve(uploadBrandResponseMock))

        await controller.createBrand(req, res, next)

        expect(imageUpload.deleteBrand).toHaveBeenCalledWith(uploadBrandResponseMock.Location)
        expect(imageUpload.deleteBrand).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledTimes(1)
    });
});

describe('findBrandById', () => {
    it('should retrieve an brand with given id ', async () => {
        const ID = '5'
        const req = {
            params: {
                id: ID
            }
        } as Partial<Request> as Request
        await controller.findBrandById(req, res, next)
        expect(service.findBrandById).toHaveBeenCalledWith(5)
    });

    it('should throw if invalid id param', async () => {
        const req = {
            params: {}
        } as Partial<Request> as Request
        await controller.findBrandById(req, res, next)
        expect(next).toHaveBeenCalledTimes(1)
    });
});

describe('modifyBrand', () => {
    it('should ', async () => {
        const ID = '5'
        const brandNewProps: IBrandEdit = {
            name: 'new-brand-name'
        }
        const req = {
            params: {
                id: ID
            },
            body: brandNewProps
        } as Partial<Request> as Request

        await controller.modifyBrand(req, res, next)
        expect(service.modifyBrand).toHaveBeenCalledWith(5, brandNewProps)
    });

    it('should modify a brand with a new logo', async () => {
        const ID = '5'
        const brandToModify = {
            name: 'test-brand'
        }
        const uploadBrandResponseMock = { Location: 'www.test-url.com' }
        imageUpload.uploadBrand.mockImplementationOnce(() => Promise.resolve(uploadBrandResponseMock))

        const req = {
            body: brandToModify,
            file: mockFile,
            params: { id: ID }
        } as unknown as Request

        await controller.modifyBrand(req, res, next)
        expect(service.modifyBrand).toHaveBeenCalledWith(5, { ...brandToModify, logo: uploadBrandResponseMock.Location })
    });

    it('should call next error handler if error is thrown', async () => {
        const ID = '5'
        const brandToModify = {
            name: 'test-brand'
        }
        const req = {
            body: brandToModify,
            params: { id: ID }
        } as unknown as Request

        service.modifyBrand.mockImplementationOnce(() => Promise.reject(MOCK_ERROR))

        await controller.modifyBrand(req, res, next)

        expect(next).toHaveBeenCalledTimes(1)
        expect(imageUpload.deleteBrand).toHaveBeenCalledTimes(0)

    });

    it('should delete brand logo if error is thrown while modifying brand', async () => {
        const ID = '5'
        const brandToModify = {
            name: 'test-brand'
        }
        const req = {
            body: brandToModify,
            file: mockFile,
            params: { id: ID }
        } as unknown as Request

        const uploadBrandResponseMock = { Location: 'www.test-url.com' }
        imageUpload.uploadBrand.mockImplementationOnce(() => Promise.resolve(uploadBrandResponseMock))
        service.modifyBrand.mockImplementationOnce(() => Promise.reject(MOCK_ERROR))

        await controller.modifyBrand(req, res, next)

        expect(imageUpload.deleteBrand).toHaveBeenCalledWith(uploadBrandResponseMock.Location)
        expect(next).toHaveBeenCalledTimes(1)

    });
});

describe('deleteBrand', () => {
    it('should delete a brand successfully', async () => {
        const ID = '5'
        const req = {
            params: {
                id: ID
            }

        } as Partial<Request> as Request
        const mockBrandFound = new Brand('found-brand', null, 5)
        service.findBrandById.mockImplementationOnce(() => Promise.resolve(mockBrandFound))
        await controller.deleteBrand(req, res, next)
        expect(service.findBrandById).toHaveBeenCalledTimes(1)
        expect(res.send).toHaveBeenCalledTimes(1)
        expect(service.deleteBrand).toHaveBeenCalledWith(5)
    });

    it('should throw if error', async () => {
        const ID = '5'
        const req = {
            params: {
                id: ID
            }

        } as Partial<Request> as Request
        service.findBrandById.mockImplementationOnce(() => Promise.reject(MOCK_ERROR))
        await controller.deleteBrand(req, res, next)
        expect(service.findBrandById).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledTimes(1)
    });

    it('should delete image logo if brand had one', async () => {
        const ID = '5'
        const req = {
            params: {
                id: ID
            }

        } as Partial<Request> as Request
        const mockBrandFound = new Brand('found-brand', 'www.logo.com', 5)
        service.findBrandById.mockImplementationOnce(() => Promise.resolve(mockBrandFound))

        await controller.deleteBrand(req, res, next)
        expect(service.findBrandById).toHaveBeenCalledWith(5)
        expect(imageUpload.deleteBrand).toHaveBeenCalledWith(mockBrandFound.logo)
        expect(res.send).toHaveBeenCalledTimes(1)
        expect(service.deleteBrand).toHaveBeenCalledWith(5)
    });
});