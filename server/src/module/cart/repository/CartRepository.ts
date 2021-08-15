import { inject, injectable } from "inversify";
import { WhereOptions } from "sequelize/types";
import { ForeignKeyConstraintError } from 'sequelize'
import { TYPES } from "../../../config/inversify.types";
import { AbstractRepository } from "../../abstractClasses/abstractRepository";
import { ProductModel } from "../../product/module";
import { GetCartsDto } from "../dto/getCartsDto";
import { Cart } from "../entities/Cart";
import { CartItem } from "../entities/CartItem";
import { CartError } from "../error/CartError";
import { ICartItemCreateFromCartModel } from "../interface/ICartItemCreateFromCart";
import { fromDbToCart, fromDbToCartItem } from "../mapper/cartMapper";
import { CartItemModel } from "../model/CartItemModel";
import { CartModel } from "../model/CartModel";
import { IGetAllBaseQuery } from "../../common/interfaces/IGetAllBaseQuery";
import { ICartRepository } from "../interface/ICartRepository";

@injectable()
export class CartRepository extends AbstractRepository implements ICartRepository {
    constructor(
        @inject(TYPES.Cart.CartModel) private cartModel: typeof CartModel,
        @inject(TYPES.Cart.CartItemModel) private cartItemModel: typeof CartItemModel,
        @inject(TYPES.Product.Model) private productModel: typeof ProductModel
    ) {
        super()
        this.cartModel = cartModel
    }

    async getAll({ limit, offset }: IGetAllBaseQuery): Promise<GetCartsDto> {
        const { count, rows } = await this.cartModel.findAndCountAll({ limit, offset })
        const carts = rows.map(fromDbToCart)
        return new GetCartsDto(count, carts)
    }

    async getCart(id: number, userId?: number): Promise<Cart> {
        const whereOptions: WhereOptions<Cart> = {}
        whereOptions.id = id
        userId ? whereOptions.user_id = userId : ''
        const cartModel = await this.cartModel.findOne({ where: whereOptions, include: [{ association: CartModel.associations.cartItems, include: [{ association: CartItemModel.associations.product, include: [{ association: ProductModel.associations.brand }, { association: ProductModel.associations.category }] }] }] })
        if (!cartModel) {
            throw CartError.cartNotFound()
        }
        const cart = fromDbToCart(cartModel)
        return cart
    }

    async getCartItem(id: number): Promise<CartItem> {
        const cartItemModel = await this.cartItemModel.findOne({
            where: { id },
            include:
                [{
                    association: CartItemModel.associations.product,
                    include:
                        [{ association: ProductModel.associations.brand },
                        { association: ProductModel.associations.category }]
                }]
        })
        if (!cartItemModel) {
            throw CartError.cartItemNotFound()
        }
        const cartItem = fromDbToCartItem(cartItemModel)
        return cartItem
    }

    async addCartItem(cartId: number, newCartItem: ICartItemCreateFromCartModel): Promise<CartItem> {
        try {
            const cartItem = await this.cartItemModel.create({ cart_id: cartId, ...newCartItem })
            const populatedCartItem = await this.getCartItem(cartItem.id)
            return fromDbToCartItem(populatedCartItem)
        } catch (err) {
            if (err instanceof ForeignKeyConstraintError) {
                CartError.CreateErrorIfForeignKeyConstraintError(err)
            }
            throw err
        }
    }

    async removeCartItem(cartId: number, ItemId: number): Promise<boolean> {
        const id = ItemId
        const cart_id = cartId
        const cartItem = await this.cartItemModel.findOne({ where: { id, cart_id } })
        if (!cartItem) {
            throw CartError.cartItemNotFound()
        }
        await cartItem.destroy()
        return true
    }

    async modifyCartItemQuantity(cartId: number, cartItemId: number, quantity: number): Promise<boolean> {
        const id = cartItemId
        const cart_id = cartId
        const [updatedItemsCount] = await this.cartItemModel.update({ quantity }, { where: { id, cart_id } })
        if (!updatedItemsCount) {
            throw CartError.cartItemNotFound()
        }
        return true
    }

    async removeAllItemsFromCart(cartId: number): Promise<number> {
        const cart_id = cartId
        return await this.cartItemModel.destroy({ where: { cart_id } })
    }
}