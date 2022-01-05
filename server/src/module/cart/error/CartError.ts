import { StatusCodes } from "http-status-codes"
import { ForeignKeyConstraintError } from "sequelize/types"
import { BaseError } from "../../common/error/BaseError"

export const CART_ERROR_MESSAGE = {
    NOT_FOUND: 'Cart not found',
    CART_ITEM_NOT_FOUND: 'Cart item not found',
    INVALID_CART_ID: 'Invalid cart id',
    INVALID_CART_ITEM_ID: 'Invalid cart item id',
    CART_ITEM_NOT_INCLUDED: 'Cart item not included',
    CART_ITEM_PRODUCT_NOT_INCLUDED: 'Cart item product not included',
    INVALID_PRODUCT_ID: 'Invalid product id'
}

export class CartError extends BaseError {
    constructor(name: string, httpCode: number, message: string) {
        super(name, httpCode, message)
    }
    static cartNotFound(): CartError {
        return new CartError(this.name, StatusCodes.NOT_FOUND, CART_ERROR_MESSAGE.NOT_FOUND)
    }

    static cartItemNotFound(): CartError {
        return new CartError(this.name, StatusCodes.NOT_FOUND, CART_ERROR_MESSAGE.CART_ITEM_NOT_FOUND)
    }

    static invalidCartId(): CartError {
        return new CartError(this.name, StatusCodes.UNPROCESSABLE_ENTITY, CART_ERROR_MESSAGE.INVALID_CART_ID)
    }

    static invalidCartItemId(): CartError {
        return new CartError(this.name, StatusCodes.UNPROCESSABLE_ENTITY, CART_ERROR_MESSAGE.INVALID_CART_ITEM_ID)
    }
    static cartItemNotIncluded(): CartError {
        return new CartError(this.name, StatusCodes.INTERNAL_SERVER_ERROR, CART_ERROR_MESSAGE.CART_ITEM_NOT_INCLUDED)
    }
    static cartItemProductNotIncluded(): CartError {
        return new CartError(this.name, StatusCodes.INTERNAL_SERVER_ERROR, CART_ERROR_MESSAGE.CART_ITEM_PRODUCT_NOT_INCLUDED)
    }
    static invalidProductId(): CartError {
        return new CartError(this.name, StatusCodes.INTERNAL_SERVER_ERROR, CART_ERROR_MESSAGE.INVALID_PRODUCT_ID)
    }

    static createErrorIfForeignKeyConstraintError(error: ForeignKeyConstraintError): void {
        if (error.index.includes("product_id")) {
            throw this.invalidProductId()
        }
        if (error.index.includes("cart_id")) {
            throw this.invalidCartId()
        }
        throw error
    }
}