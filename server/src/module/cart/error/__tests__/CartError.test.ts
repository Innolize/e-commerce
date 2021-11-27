import { StatusCodes } from 'http-status-codes';
import { ForeignKeyConstraintError } from 'sequelize/types';
import { CartError, CART_ERROR_MESSAGE } from '../CartError'

describe('CartError', () => {
    it('should create an invalidCartId Error', async () => {
        const Error = CartError.invalidCartId()

        expect(Error.message).toBe(CART_ERROR_MESSAGE.INVALID_CART_ID)
        expect(Error.httpCode).toBe(StatusCodes.UNPROCESSABLE_ENTITY)
    });
    it('should create an cartNotFound Error', async () => {
        const Error = CartError.cartNotFound()

        expect(Error.message).toBe(CART_ERROR_MESSAGE.NOT_FOUND)
        expect(Error.httpCode).toBe(StatusCodes.NOT_FOUND)
    });
    it('should create an invalidCartId Error', async () => {
        const Error = CartError.invalidCartId()

        expect(Error.message).toBe(CART_ERROR_MESSAGE.INVALID_CART_ID)
        expect(Error.httpCode).toBe(StatusCodes.UNPROCESSABLE_ENTITY)
    });

    it('should create an invalidCartItemId Error', async () => {
        const Error = CartError.invalidCartItemId()

        expect(Error.message).toBe(CART_ERROR_MESSAGE.INVALID_CART_ITEM_ID)
        expect(Error.httpCode).toBe(StatusCodes.UNPROCESSABLE_ENTITY)
    });
    it('should create an cartItemNotIncluded Error', async () => {
        const Error = CartError.cartItemNotIncluded()

        expect(Error.message).toBe(CART_ERROR_MESSAGE.CART_ITEM_NOT_INCLUDED)
        expect(Error.httpCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
    });
    it('should create an cartItemProductNotIncluded Error', async () => {
        const Error = CartError.cartItemProductNotIncluded()

        expect(Error.message).toBe(CART_ERROR_MESSAGE.CART_ITEM_PRODUCT_NOT_INCLUDED)
        expect(Error.httpCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
    });
    it('should create an invalidProductId Error', async () => {
        const Error = CartError.invalidProductId()

        expect(Error.message).toBe(CART_ERROR_MESSAGE.INVALID_PRODUCT_ID)
        expect(Error.httpCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
    });
});

describe('createErrorIfForeignKeyConstraintError', () => {
    it('should create an invalidProductError if index is `product_id`', () => {
        const CONSTRAINT_ERROR_INDEX = 'product_id'
        const constraintError = {
            index: CONSTRAINT_ERROR_INDEX
        } as unknown as ForeignKeyConstraintError
        expect.assertions(1)
        try {
            CartError.createErrorIfForeignKeyConstraintError(constraintError)
        } catch (err) {
            expect(err).toEqual(CartError.invalidProductId())
        }
    });

    it('should create an invalidCartIdError if index is `cart_id`', () => {
        const CONSTRAINT_ERROR_INDEX = 'cart_id'
        const constraintError = {
            index: CONSTRAINT_ERROR_INDEX
        } as unknown as ForeignKeyConstraintError
        expect.assertions(1)
        try {
            CartError.createErrorIfForeignKeyConstraintError(constraintError)
        } catch (err) {
            expect(err).toEqual(CartError.invalidCartId())
        }
    });

    it('should not throw an error ', () => {
        const CONSTRAINT_ERROR_INDEX = 'invalid_property'
        const constraintError = {
            index: CONSTRAINT_ERROR_INDEX
        } as unknown as ForeignKeyConstraintError
        expect.assertions(0)
        try {
            CartError.createErrorIfForeignKeyConstraintError(constraintError)
        } catch (err) {
            expect(err).toBeTruthy()
        }
    });
});