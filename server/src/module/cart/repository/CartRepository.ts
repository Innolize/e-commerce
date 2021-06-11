import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractRepository } from "../../abstractClasses/abstractRepository";
import { Cart } from "../entities/Cart";
import { CartItem } from "../entities/CartItem";
import { CartError } from "../error/CartError";
import { ICartItemCreateFromCartModel } from "../interface/ICartItemCreateFromCart";
import { fromDbToCart, fromDbToCartItem } from "../mapper/cartMapper";
import { CartItemModel } from "../model/CartItemModel";
import { CartModel } from "../model/CartModel";

@injectable()
export class CartRepository extends AbstractRepository {
    constructor(
        @inject(TYPES.Cart.CartModel) private cartModel: typeof CartModel,
        @inject(TYPES.Cart.CartItemModel) private cartItemModel: typeof CartItemModel
    ) {
        super()
        this.cartModel = cartModel
    }

    async getAll(): Promise<Cart[]> {
        const cartModelArray = await this.cartModel.findAll()
        const carts = cartModelArray.map(fromDbToCart)
        return carts
    }

    async addCartItem(cartId: number, newCartItem: ICartItemCreateFromCartModel): Promise<CartItem[]> {
        const cart = await this.cartModel.findByPk(cartId, { include: CartModel.associations.cartItems })
        if (!cart) {
            throw CartError.cartNotFound()
        }
        await cart.createCartItem(newCartItem)
        const cartItems = await cart.getCartItems({ include: { association: CartItemModel.associations.product } })
        const response = cartItems.map(fromDbToCartItem)
        return response
    }

    async removeCartItem(cartId: number, cartItemId: number): Promise<boolean> {
        const cart = await this.cartModel.findByPk(cartId)
        if (!cart) {
            throw CartError.cartNotFound()
        }
        const cartItem = await this.cartItemModel.findOne({ where: { id: cartItemId, cart_id: cartId } })
        if (!cartItem) {
            throw CartError.cartItemNotFound()
        }

        await cartItem.destroy()

        return true
    }

    async modifyCartItemQuantity(cartId: number, cartItemId: number, quantity: number): Promise<CartItem> {
        const cart = await this.cartModel.findByPk(cartId)
        if (!cart) {
            throw CartError.cartNotFound()
        }
        const cartItem = await this.cartItemModel.findOne({ where: { id: cartItemId, cart_id: cartId } })
        if (!cartItem) {
            throw CartError.cartItemNotFound()
        }
        const cartItemUpdated = await cartItem.update({ quantity })
        const response = fromDbToCartItem(cartItemUpdated)
        return response
    }
}