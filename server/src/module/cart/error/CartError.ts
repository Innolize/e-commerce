import { StatusCodes } from "http-status-codes"
import { ForeignKeyConstraintError } from "sequelize/types"
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
    static InvalidProductId(): CartError {
        return new CartError(this.name, StatusCodes.INTERNAL_SERVER_ERROR, `Invalid product id`)
    }

    static CreateErrorIfForeignKeyConstraintError(error: ForeignKeyConstraintError): void {
        if (error.index.includes("product_id")) {
            throw this.InvalidProductId()
        }
        if (error.index.includes("cart_id")) {
            throw this.invalidCartId()
        }
    }
}