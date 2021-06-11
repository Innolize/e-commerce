import { inject, injectable } from "inversify";
import { Association } from "sequelize/types";
import { TYPES } from "../../../config/inversify.types";
import { AbstractRepository } from "../../abstractClasses/abstractRepository";
import { Cart } from "../entities/Cart";
import { CartItem } from "../entities/CartItem";
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
        const test = await this.cartModel.findByPk(2)
        if (!test) {
            const errorCart = [{
                "id": 1,
                "active": true,
                "userId": 15
            }] as Cart[]
            return errorCart
        }
        const itemToCreate: ICartItemCreateFromCartModel = { product_id: 2, quantity: 2 }
        await test.createCartItem(itemToCreate)
        const response = await this.cartModel.findAll({ include: CartModel.associations.cartItems })


        const carts = response.map(x => x.toJSON()) as Cart[]


        return carts
    }

    async addCartItem(cartId: number, newCartItem: ICartItemCreateFromCartModel): Promise<CartItem[]> {
        const cart = await this.cartModel.findByPk(cartId, { include: CartModel.associations.cartItems })
        if (!cart) {
            throw new Error('Cart does not exist!')
        }
        await cart.createCartItem(newCartItem)
        const finalCartItems = await cart.getCartItems()


        return finalCartItems.map(x => x.toJSON()) as CartItem[]
    }
}