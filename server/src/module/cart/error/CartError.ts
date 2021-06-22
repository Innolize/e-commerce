import { StatusCodes } from "http-status-codes"
import { BaseError } from "../../common/error/BaseError"

export class CartError extends BaseError {
    constructor(name: string, httpCode: number, message: string) {
        super(name, httpCode, message)
    }
    static cartNotFound(): CartError {
        return new CartError(this.name, StatusCodes.NOT_FOUND, 'Cart not found')
    }

    static cartItemNotFound(): CartError {
        return new CartError(this.name, StatusCodes.NOT_FOUND, 'Cart item not found')
    }

    static invalidCartId(): CartError {
        return new CartError(this.name, StatusCodes.UNPROCESSABLE_ENTITY, 'Invalid cart id')
    }

    static invalidCartItemId(): CartError {
        return new CartError(this.name, StatusCodes.UNPROCESSABLE_ENTITY, 'Invalid cart item id')
    }
    static CartItemNotIncluded(): CartError {
        return new CartError(this.name, StatusCodes.INTERNAL_SERVER_ERROR, 'Cart item not included')
    }
    static CartItemProductNotIncluded(): CartError {
        return new CartError(this.name, StatusCodes.INTERNAL_SERVER_ERROR, 'Cart item product not included')
    }
}