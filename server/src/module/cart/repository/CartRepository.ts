import { inject, injectable } from "inversify";
import { WhereOptions } from "sequelize/types";
import { TYPES } from "../../../config/inversify.types";
import { AbstractRepository } from "../../abstractClasses/abstractRepository";
import { ProductModel } from "../../product/module";
import { GetCartsDto } from "../dto/getCartsDto";
import { Cart } from "../entities/Cart";
import { CartItem } from "../entities/CartItem";
import { CartError } from "../error/CartError";
import { ICartGetAllQuery } from "../interface/ICartGetAllQuery";
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

    async getAll({ limit = 20, offset = 0, userId }: ICartGetAllQuery): Promise<GetCartsDto> {
        const whereOptions: WhereOptions<Cart> = {}
        userId ? whereOptions.user_id = userId : ''
        const { count, rows } = await this.cartModel.findAndCountAll({ where: whereOptions, limit, offset })
        const carts = rows.map(fromDbToCart)
        return new GetCartsDto(count, carts)
    }

    async getCart(id: number, userId: number): Promise<Cart> {
        const user_id = userId
        const cartModel = await this.cartModel.findOne({ where: { id, user_id }, include: [{ association: CartModel.associations.cartItems, include: [{ association: CartItemModel.associations.product, include: [{ association: ProductModel.associations.brand }, { association: ProductModel.associations.category }] }] }] })
        if (!cartModel) {
            throw CartError.cartNotFound()
        }
        const carts = fromDbToCart(cartModel)
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