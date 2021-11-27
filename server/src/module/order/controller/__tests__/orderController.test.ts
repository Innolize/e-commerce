import 'reflect-metadata'
import { application, Request, Response } from 'express'
import { mocked } from 'ts-jest/utils'
import { Multer } from 'multer'
import { OrderController } from '../OrderController'
import { IGetAllBaseQuery } from '../../../common/interfaces/IGetAllBaseQuery'
import { Role } from '../../../authorization/entities/Role'
import { CartError } from '../../../cart/error/CartError'
import { Cart } from '../../../cart/entities/Cart'
import { IPaymentType } from '../../../payment/interfaces/IPayment'
import { CartItem } from '../../../cart/entities/CartItem'
import { Order } from '../../entities/Order'

jest.mock('express')
const app = mocked(application, true)

const orderService = {
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

const cartService = {
    addCartItem: jest.fn(),
    removeCartItem: jest.fn(),
    clearCartItems: jest.fn(),
    getCart: jest.fn(),
    getCarts: jest.fn()
}

const next = jest.fn()

const res = {
    status: jest.fn(() => res),
    send: jest.fn()
} as unknown as Response

const TEST_ERROR = new Error('test-error')

let controller: OrderController

beforeEach(() => {
    controller = new OrderController(orderService, cartService, uploadMiddleware)
});

afterEach(() => {
    jest.clearAllMocks()
});

describe('configureRoutes', () => {
    it('should configure routes correctly ', () => {
        controller.configureRoutes(app)
        expect(app.get).toHaveBeenCalledTimes(2)
        expect(app.post).toHaveBeenCalledTimes(1)
        expect(app.delete).toHaveBeenCalledTimes(1)
    });
});

const ADMIN_CART = new Cart(1, 1, [])
const ADMIN_USER = {
    id: 1,
    mail: 'test-user@gmail.com',
    role: new Role('ADMIN', 1),
    role_id: 1,
    cart: ADMIN_CART
}

describe('getOrders', () => {
    const QUERY_PARAMS: IGetAllBaseQuery = { limit: 10, offset: 0 }


    const req = {
        query: QUERY_PARAMS,
        user: ADMIN_USER
    } as unknown as Request

    it('should work correctly ', async () => {
        await controller.getOrders(req, res, next)
        expect(orderService.getAll).toHaveBeenCalledWith(ADMIN_USER, QUERY_PARAMS.limit, QUERY_PARAMS.offset)
        expect(res.send).toHaveBeenCalledTimes(1)
        expect(res.send).toHaveBeenCalledWith(undefined)
        expect(res.status).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledWith(200)
    });

    it('should call next function if error is thrown', async () => {
        orderService.getAll.mockImplementationOnce(() => Promise.reject(TEST_ERROR))
        await controller.getOrders(req, res, next)
        expect(next).toHaveBeenCalledWith(TEST_ERROR)
    });
});

describe('create', () => {
    it('should throw if user does not have a cart', async () => {
        const { cart, ...rest } = ADMIN_USER
        const CARTLESS_ADMIN = rest
        const req = {
            user: CARTLESS_ADMIN
        } as unknown as Request
        await controller.create(req, res, next)
        expect(next).toHaveBeenCalledWith(CartError.cartNotFound())
    });
    it('should throw if order has invalid payment value ', async () => {
        const PAYMENT = 'INVALID_PAYMENT'
        const req = {
            user: ADMIN_USER,
            body: {
                paymentType: PAYMENT
            }
        } as unknown as Request
        await controller.create(req, res, next)
        expect(next).toHaveBeenCalledTimes(1)
    });
    it('should create an order then clean items from cart', async () => {
        const PAYMENT: IPaymentType = 'CREDIT CARD'
        const req = {
            user: ADMIN_USER,
            body: {
                paymentType: PAYMENT
            }
        } as unknown as Request
        const CART_ITEM_1 = new CartItem(1, 1, 5, 1)
        const CART_ITEM_2 = new CartItem(1, 1, 5, 1)
        const MOCKED_CART = new Cart(1, 1, [CART_ITEM_1, CART_ITEM_2])
        cartService.getCart.mockImplementationOnce(() => Promise.resolve(MOCKED_CART))
        await controller.create(req, res, next)
        expect(orderService.create).toHaveBeenCalledWith(MOCKED_CART, ADMIN_USER, PAYMENT)
        const ADMIN_CART_ID = ADMIN_USER.cart.id
        expect(cartService.getCart).toHaveBeenCalledWith(ADMIN_CART_ID, ADMIN_USER)
        expect(cartService.clearCartItems).toHaveBeenCalledTimes(1)
    });
});

describe('getSingle', () => {
    it('should call service.getSingle once', async () => {
        const ORDER = new Order(1, 1, [], {
            amount: 100, id: 1,
            order_id: 1,
            status: 'PAID',
            type: 'CASH'
        })
        const req = {
            params: { id: '5' },
            user: ADMIN_USER
        } as unknown as Request

        orderService.getSingle.mockImplementationOnce(() => Promise.resolve(ORDER))
        await controller.getSingle(req, res, next)
        const PARAM_ID_NUMBER = Number(req.params.id)
        expect(orderService.getSingle).toHaveBeenCalledWith(PARAM_ID_NUMBER)
        expect(orderService.getSingle).toHaveBeenCalledTimes(1)
        expect(res.send).toHaveBeenCalledWith(ORDER)
    });

    it('should call next if invalid id', async () => {
        const INVALID_ID = 'invalid-id'
        const req = {
            params: { id: INVALID_ID }
        } as unknown as Request
        await controller.getSingle(req, res, next)
        expect(next).toHaveBeenCalledTimes(1)
    });
});

describe('delete', () => {
    it('should call service.delete once', async () => {
        const req = {
            params: { id: '5' },
            user: ADMIN_USER
        } as unknown as Request

        orderService.delete.mockImplementationOnce(() => Promise.resolve(true))
        await controller.delete(req, res, next)
        const PARAM_ID_NUMBER = Number(req.params.id)
        expect(orderService.delete).toHaveBeenCalledWith(PARAM_ID_NUMBER, ADMIN_USER)
        expect(orderService.delete).toHaveBeenCalledTimes(1)
        expect(res.send).toHaveBeenCalledWith(true)
    });

    it('should call next if invalid id', async () => {
        const INVALID_ID = 'invalid-id'
        const req = {
            params: { id: INVALID_ID }
        } as unknown as Request
        await controller.delete(req, res, next)
        expect(next).toHaveBeenCalledTimes(1)
    });
});