import { application, NextFunction, Request, Response } from 'express';
jest.mock('express')
import { Multer } from 'multer';
import 'reflect-metadata'
import { mocked } from 'ts-jest/utils';
import { IUserWithAuthorization } from '../../../authorization/interfaces/IUserWithAuthorization';
import { ICartItemCreateFromCartModel } from '../../interface/ICartItemCreateFromCart';
import { CartController } from "../CartController";

const service = {
    getCart: jest.fn(),
    clearCartItems: jest.fn(),
    removeCartItem: jest.fn(),
    addCartItem: jest.fn(),
    getCarts: jest.fn()
}

const uploadMiddleware: Multer = {
    any: jest.fn(),
    array: jest.fn(),
    fields: jest.fn(),
    none: jest.fn(),
    single: jest.fn()
}


let controller: CartController


const MOCKED_APP = mocked(application, true)

const MOCK_NEXT: NextFunction = jest.fn()

const res = {
    status: jest.fn(() => res),
    send: jest.fn()
} as Partial<Response> as Response

const MOCK_USER = { id: 1, name: 'carlos', role: 'admin' } as unknown as IUserWithAuthorization


beforeAll(() => {
    controller = new CartController(service, uploadMiddleware)
});

afterEach(() => {
    jest.clearAllMocks()
});

describe('configureRoutes', () => {
    it('should configure routes correctly', () => {
        controller.configureRoutes(MOCKED_APP)
        expect(MOCKED_APP.get).toHaveBeenCalledTimes(2)
        expect(MOCKED_APP.post).toHaveBeenCalledTimes(1)
        expect(MOCKED_APP.delete).toHaveBeenCalledTimes(1)
    });
});

describe('getAllCarts', () => {
    it('should get all carts ', async () => {
        const req = {
            query: {
                limit: '3',
                offset: '0'
            },
            user: MOCK_USER
        } as Partial<Request> as Request
        const EXPECTED_LIMIT = 3
        const EXPECTED_OFFSET = 0
        await controller.getAllCarts(req, res, MOCK_NEXT)
        expect(service.getCarts).toHaveBeenCalledTimes(1)
        expect(service.getCarts).toHaveBeenCalledWith({ limit: EXPECTED_LIMIT, offset: EXPECTED_OFFSET }, MOCK_USER)
    });

    it('should call next error handle if thrown', async () => {
        const req = {
            query: {},
            user: MOCK_USER
        } as Partial<Request> as Request
        const ERROR = new Error('test')
        service.getCarts.mockImplementationOnce(() => Promise.reject(ERROR))
        await controller.getAllCarts(req, res, MOCK_NEXT)
        expect(MOCK_NEXT).toHaveBeenCalledTimes(1)
        expect(MOCK_NEXT).toHaveBeenCalledWith(ERROR)
    });

});

describe('getSingleCart', () => {
    it('should retrieve a single cart', async () => {
        const req = {
            params: {
                cartId: '3'
            },
            user: MOCK_USER
        } as Partial<Request> as Request
        const CART_ID = 3
        await controller.getSingleCart(req, res, MOCK_NEXT)
        expect(service.getCart).toHaveBeenCalledTimes(1)
        expect(service.getCart).toHaveBeenCalledWith(CART_ID, MOCK_USER)
        expect(res.send).toHaveBeenCalledTimes(1)
    });
    it('should throw if no user in request', async () => {
        const req = {
            params: {
                cartId: '3'
            },
        } as Partial<Request> as Request
        await controller.getSingleCart(req, res, MOCK_NEXT)
        expect(MOCK_NEXT).toHaveBeenCalledTimes(1)
    });
});

describe('addCartItem', () => {
    it('should call add a cart item', async () => {
        const cartItem: ICartItemCreateFromCartModel = {
            product_id: 12,
            quantity: 3
        }
        const req = {
            params: {
                cartId: '3'
            },
            body: cartItem,
            user: MOCK_USER
        } as Partial<Request> as Request
        const CART_ID = 3
        await controller.addCartItem(req, res, MOCK_NEXT)
        expect(service.addCartItem).toHaveBeenCalledTimes(1)
        expect(service.addCartItem).toHaveBeenCalledWith(CART_ID, cartItem, MOCK_USER)
        expect(res.send).toHaveBeenCalledTimes(1)
    });
    it('should call error handler if error was thrown', async () => {
        const req = {
            params: {
                cartId: '3'
            },
            user: MOCK_USER
        } as Partial<Request> as Request
        const ERROR = new Error('test-error')
        service.addCartItem.mockImplementationOnce(() => Promise.reject(ERROR))
        await controller.addCartItem(req, res, MOCK_NEXT)
        expect(MOCK_NEXT).toHaveBeenCalledTimes(1)
        expect(MOCK_NEXT).toHaveBeenCalledWith(ERROR)
    });
});

describe('removeCartItem', () => {
    it('should remove item from cart', async () => {
        const req = {
            params: {
                cartId: '1',
                itemId: '2'
            },
            user: MOCK_USER
        } as Partial<Request> as Request
        const EXPECTED_CART_ID = 1
        const EXPECTED_ITEM_ID = 2
        await controller.removeCartItem(req, res, MOCK_NEXT)
        expect(service.removeCartItem).toHaveBeenCalledTimes(1)
        expect(service.removeCartItem).toHaveBeenCalledWith(EXPECTED_CART_ID, EXPECTED_ITEM_ID, MOCK_USER)
        expect(res.send).toHaveBeenCalledTimes(1)
    });

    it('should call error handler if error was thrown', async () => {
        const req = {
            params: {
                cartId: '1',
                itemId: '2'
            },
            user: MOCK_USER
        } as Partial<Request> as Request
        const ERROR = new Error('test-error')
        service.removeCartItem.mockImplementationOnce(() => Promise.reject(ERROR))
        await controller.removeCartItem(req, res, MOCK_NEXT)
        expect(MOCK_NEXT).toHaveBeenCalledTimes(1)
        expect(MOCK_NEXT).toHaveBeenCalledWith(ERROR)
    });
});