import 'reflect-metadata'
import { ProductController } from '../productController'
import { Multer } from 'multer'
import { mocked } from 'ts-jest/utils'
import { application, NextFunction, Request, Response } from 'express'
import { GetProductsReqDto } from '../../dto/getProductsReqDto'
import { IProductCreate } from '../../interfaces/IProductCreate'
import { Product } from '../../entity/Product'
import { IProductEdit } from '../../interfaces/IProductEdit'
import { BaseError } from '../../../common/error/BaseError'
jest.mock('express')
let controller: ProductController

const productService = {
    createProduct: jest.fn(),
    deleteProduct: jest.fn(),
    verifyCategoryAndBrandExistence: jest.fn(),
    getAllProducts: jest.fn(),
    modifyProduct: jest.fn(),
    findProductById: jest.fn(),
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

const imageUpload = {
    deleteBrand: jest.fn(),
    deleteProduct: jest.fn(),
    uploadBrand: jest.fn(),
    uploadProduct: jest.fn()
}

const mockFile = {
    fieldname: 'product_image',
    originalname: 'product.png',
    encoding: '7bit',
    mimetype: 'image/png',
    buffer: Buffer.from('hellow world', 'utf-8'),
    size: 118057
}

const MOCK_ERROR = new Error('test-error')

beforeAll(() => {
    controller = new ProductController(productService, uploadMiddleware, imageUpload)
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

describe('getAllProducts', () => {
    it('should retrieve a list of produsts', async () => {
        const EXPECTED_PRODUCT_QUERY = new GetProductsReqDto(5, 0, 'test', undefined)
        const req = {
            query: EXPECTED_PRODUCT_QUERY
        } as unknown as Request

        await controller.getAllProducts(req, res, next)

        expect(productService.getAllProducts).toHaveBeenCalledTimes(1)
        expect(productService.getAllProducts).toHaveBeenCalledWith(EXPECTED_PRODUCT_QUERY)
        expect(res.status).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledTimes(1)
    });
    it('should call next function if an error is thrown', async () => {
        const req = {
            query: {
                limit: 'invalid-limit',
                offset: 'invalid-offset'
            }
        } as unknown as Request

        await controller.getAllProducts(req, res, next)

        expect.assertions(1)
        expect(next).toHaveBeenCalledTimes(1)
    });
});

describe('createProduct', () => {
    const NEW_PRODUCT: IProductCreate = {
        description: 'test-description',
        id_brand: 1,
        id_category: 1,
        image: null,
        name: 'test-name',
        price: 200,
        stock: true,
    }

    it('should create a product successfully', async () => {
        const req = {
            body: NEW_PRODUCT
        } as unknown as Request

        await controller.createProduct(req, res, next)

        expect(productService.createProduct).toBeCalledTimes(1)
        expect(productService.createProduct).toBeCalledWith(NEW_PRODUCT)
        expect(res.send).toBeCalledTimes(1)
    });

    it('should create a product with an image successfully', async () => {

        const req = {
            body: NEW_PRODUCT,
            file: mockFile
        } as unknown as Request
        imageUpload.uploadProduct.mockImplementationOnce(() => Promise.resolve({ Location: 'image-url.com' }))

        await controller.createProduct(req, res, next)

        expect(imageUpload.uploadProduct).toBeCalledTimes(1)
        expect(imageUpload.uploadProduct).toBeCalledWith(mockFile.buffer, mockFile.originalname)
        expect(productService.createProduct).toBeCalledWith({ ...NEW_PRODUCT, image: 'image-url.com' })
        expect(productService.createProduct).toBeCalledTimes(1)
        expect(res.send).toBeCalledTimes(1)
    });

    it('should delete an uploaded image when an error is thrown while creating product ', async () => {
        const req = {
            body: NEW_PRODUCT,
            file: mockFile
        } as unknown as Request
        productService.createProduct.mockImplementationOnce(() => Promise.reject(MOCK_ERROR))
        const uploadProductResponse = { Location: 'image-url.com' }
        imageUpload.uploadProduct.mockImplementationOnce(() => Promise.resolve(uploadProductResponse))

        await controller.createProduct(req, res, next)

        expect(imageUpload.uploadProduct).toHaveBeenCalledTimes(1)
        expect(productService.createProduct).toBeCalledTimes(1)
        expect(imageUpload.deleteProduct).toHaveBeenCalledTimes(1)
        expect(imageUpload.deleteProduct).toHaveBeenCalledWith(uploadProductResponse.Location)
        expect(next).toHaveBeenCalledWith(MOCK_ERROR)
    });

    it('should throw if invalid product', async () => {
        const INVALID_PRODUCT = {
            ...NEW_PRODUCT,
            price: 'invalid-price'
        }
        const req = {
            body: INVALID_PRODUCT
        } as unknown as Request

        await controller.createProduct(req, res, next)

        expect(imageUpload.deleteProduct).toHaveBeenCalledTimes(0)
        expect(next).toHaveBeenCalledTimes(1)
    });
});

describe('findProductById', () => {
    const PRODUCT_ID = 5
    const req = {
        params: {
            id: PRODUCT_ID
        }
    } as unknown as Request
    it('should retrieve an user', async () => {
        const FOUND_PRODUCT: Product = new Product('product-5', 'image-5', 'description-5', 100, true, 1, 1, 5)
        productService.findProductById.mockImplementationOnce(() => Promise.resolve(FOUND_PRODUCT))

        await controller.findProductById(req, res, next)

        expect(productService.findProductById).toHaveBeenCalledTimes(1)
        expect(productService.findProductById).toHaveBeenCalledWith(5)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(FOUND_PRODUCT)
    });

    it('should call next if an error was thrown', async () => {
        productService.findProductById.mockImplementationOnce(() => Promise.reject(MOCK_ERROR))

        await controller.findProductById(req, res, next)

        expect(productService.findProductById).toHaveBeenCalledWith(PRODUCT_ID)
        expect(res.status).toHaveBeenCalledTimes(0)
        expect(next).toHaveBeenCalledWith(MOCK_ERROR)
    });
});

describe('modifyProduct', () => {
    const PRODUCT_ID = 5
    const EDITED_PROPERTIES: IProductEdit = { name: 'new-name' }
    it('should modify a product successfully', async () => {
        const req = {
            params: {
                id: PRODUCT_ID
            },
            body: EDITED_PROPERTIES
        } as unknown as Request

        await controller.modifyProduct(req, res, next)

        expect(productService.modifyProduct).toHaveBeenCalledWith(5, EDITED_PROPERTIES)
        expect(res.status).toHaveBeenCalledWith(200)
    });

    it('should modify a product with new image ', async () => {
        imageUpload.uploadProduct.mockImplementationOnce(() => Promise.resolve({ Location: 'image-url.com' }))

        const req = {
            params: {
                id: PRODUCT_ID
            },
            body: EDITED_PROPERTIES,
            file: mockFile
        } as unknown as Request

        await controller.modifyProduct(req, res, next)

        expect(imageUpload.uploadProduct).toHaveBeenCalledWith(mockFile.buffer, mockFile.originalname)
        expect(res.status).toHaveBeenCalledTimes(1)
    });

    it('should delete uploaded image if error was thrown', async () => {
        const imageUploadResponseMock = { Location: 'image-url.com' }
        imageUpload.uploadProduct.mockImplementationOnce(() => Promise.resolve(imageUploadResponseMock))
        productService.modifyProduct.mockImplementationOnce(() => Promise.reject(MOCK_ERROR))

        const req = {
            params: {
                id: PRODUCT_ID
            },
            body: EDITED_PROPERTIES,
            file: mockFile
        } as unknown as Request

        await controller.modifyProduct(req, res, next)

        expect(imageUpload.uploadProduct).toHaveBeenCalledWith(mockFile.buffer, mockFile.originalname)
        expect(imageUpload.deleteProduct).toHaveBeenCalledWith(imageUploadResponseMock.Location)
        expect(next).toHaveBeenCalledWith(MOCK_ERROR)
    });

    it('should throw if invalid product', async () => {
        productService.modifyProduct.mockImplementationOnce(() => Promise.reject(MOCK_ERROR))
        const req = {
            params: {
                id: PRODUCT_ID
            },
            body: EDITED_PROPERTIES,
        } as unknown as Request

        await controller.modifyProduct(req, res, next)

        expect(imageUpload.deleteProduct).toHaveBeenCalledTimes(0)
        expect(next).toHaveBeenCalledWith(MOCK_ERROR)
    });

    it('should throw if empty form', async () => {
        const error = new BaseError('BaseError', 422, 'Form cannot be empty!')
        const req = {
            params: {
                id: PRODUCT_ID
            },
            body: {},
        } as unknown as Request

        await controller.modifyProduct(req, res, next)

        expect(imageUpload.deleteProduct).toHaveBeenCalledTimes(0)
        expect(next).toHaveBeenCalledWith(error)
    });
});

describe('deleteProduct', () => {
    it('should delete a product successfully', async () => {
        const FOUND_PRODUCT: Product = new Product('product-5', null, 'description-5', 100, true, 1, 1, 5)
        productService.findProductById.mockImplementationOnce(() => Promise.resolve(FOUND_PRODUCT))
        const PRODUCT_ID = 5
        const req = {
            params: {
                id: PRODUCT_ID
            }
        } as unknown as Request

        await controller.deleteProduct(req, res, next)
        expect(productService.deleteProduct).toHaveBeenCalledTimes(1)
        expect(res.send).toHaveBeenCalledTimes(1)
    });

    it('should call next if an error was thrown', async () => {
        const error = new BaseError('BaseError', 400, "Invalid id param")
        const INVALID_PRODUCT_ID = 'invalid-param'
        const req = {
            params: {
                id: INVALID_PRODUCT_ID
            }
        } as unknown as Request
        await controller.deleteProduct(req, res, next)
        expect(next).toHaveBeenCalledWith(error)
    });

    it('should delete an image if product has one', async () => {
        const PRODUCT_FOUND_IMAGE = 'image-5'
        const FOUND_PRODUCT: Product = new Product('product-5', PRODUCT_FOUND_IMAGE, 'description-5', 100, true, 1, 1, 5)
        productService.findProductById.mockImplementationOnce(() => Promise.resolve(FOUND_PRODUCT))
        const PRODUCT_ID = 5
        const req = {
            params: {
                id: PRODUCT_ID
            }
        } as unknown as Request
        await controller.deleteProduct(req, res, next)
        expect(imageUpload.deleteProduct).toHaveBeenCalledWith(PRODUCT_FOUND_IMAGE)
        expect(res.send).toHaveBeenCalledTimes(1)
    });
});