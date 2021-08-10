import { ForbiddenError } from "@casl/ability";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractService } from "../../abstractClasses/abstractService";
import { IUserWithAuthorization } from "../../authorization/interfaces/IUserWithAuthorization";
import { appAbility } from "../../authorization/util/abilityBuilder";
import { IGetAllBaseQuery } from "../../common/interfaces/IGetAllBaseQuery";
import { GetCartsDto } from "../dto/getCartsDto";
import { Cart } from "../entities/Cart";
import { CartItem } from "../entities/CartItem";
import { ICartItemCreateFromCartModel } from "../interface/ICartItemCreateFromCart";
import { CartRepository } from "../repository/CartRepository";

@injectable()
export class CartService extends AbstractService {
    private test: string
    constructor(
        @inject(TYPES.Cart.Repository) private cartRepository: CartRepository
    ) {
        super()
    }

    async getCarts(queryParams: IGetAllBaseQuery, user: IUserWithAuthorization): Promise<GetCartsDto> {
        ForbiddenError.from<appAbility>(user.role.permissions).throwUnlessCan('read', 'all')
        return await this.cartRepository.getAll(queryParams)
    }

    async getCart(id: number, user: IUserWithAuthorization): Promise<Cart> {
        const ADMIN_ID = 1
        let cart: Cart
        if (user.role_id === ADMIN_ID) {
            cart = await this.cartRepository.getCart(id)
        } else {
            cart = await this.cartRepository.getCart(id, user.id)
        }
        ForbiddenError.from<appAbility>(user.role.permissions).throwUnlessCan('read', cart)
        return cart
    }

    async addCartItem(cartId: number, newCartItem: ICartItemCreateFromCartModel, user: IUserWithAuthorization): Promise<Cart> {
        const cart = await this.cartRepository.getCart(cartId, user.id)
        const { permissions } = user.role
        ForbiddenError.from<appAbility>(permissions).throwUnlessCan('update', cart)
        const foundItem = cart.cartItems?.find(x => x.product_id === newCartItem.product_id)
        if (foundItem) {
            const cartItemId = foundItem.id as number
            const { quantity } = newCartItem
            await this.modifyCartItemQuantity(cartId, cartItemId, quantity)
            const updatedCart = await this.cartRepository.getCart(cartId, user.id)
            return updatedCart
        }
        await this.cartRepository.addCartItem(cartId, newCartItem)
        const updatedCart = await this.cartRepository.getCart(cartId, user.id)
        return updatedCart
    }

    async removeCartItem(cartId: number, cartItemId: number, user: IUserWithAuthorization): Promise<Cart> {
        const cart = await this.cartRepository.getCart(cartId, user.id)
        ForbiddenError.from<appAbility>(user.role.permissions).throwUnlessCan('delete', cart)
        await this.cartRepository.removeCartItem(cartId, cartItemId)
        const updatedCart = await this.cartRepository.getCart(cartId, user.id)
        return updatedCart
    }

    private async modifyCartItemQuantity(cartId: number, cartItemId: number, quantity: number): Promise<CartItem> {
        await this.cartRepository.modifyCartItemQuantity(cartId, cartItemId, quantity)
        return await this.cartRepository.getCartItem(cartItemId)
    }

    async clearCartItems(cartId: number, user: IUserWithAuthorization): Promise<void> {
        const cart = await this.cartRepository.getCart(cartId, user.id)
        ForbiddenError.from<appAbility>(user.role.permissions).throwUnlessCan('delete', cart)
        await this.cartRepository.removeAllItemsFromCart(cartId)
    }
}



