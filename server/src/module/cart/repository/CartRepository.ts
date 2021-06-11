import { inject, injectable } from "inversify";
import { Association } from "sequelize/types";
import { TYPES } from "../../../config/inversify.types";
import { AbstractRepository } from "../../abstractClasses/abstractRepository";
import { Cart } from "../entities/Cart";
import { CartItem } from "../entities/CartItem";
import { CartError } from "../error/CartError";
import { ICartItemCreateFromCartModel } from "../interface/ICartItemCreateFromCart";
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
        const carts = cartModelArray.map(x => x.toJSON()) as Cart[]
        return carts
    }

    async addCartItem(cartId: number, newCartItem: ICartItemCreateFromCartModel): Promise<CartItem[]> {
        const cart = await this.cartModel.findByPk(cartId, { include: CartModel.associations.cartItems })
        if (!cart) {
            throw CartError.notFound()
        }
        await cart.createCartItem(newCartItem)
        const finalCartItems = await cart.getCartItems({ include: { association: CartItemModel.associations.product } })
        return finalCartItems.map(x => x.toJSON()) as CartItem[]
    }
}