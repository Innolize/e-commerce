import { ForbiddenError } from "@casl/ability";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractService } from "../../abstractClasses/abstractService";
import { IRoleName } from "../../authorization/interfaces/IRole";
import { IUserWithAuthorization } from "../../authorization/interfaces/IUserWithAuthorization";
import { appAbility } from "../../authorization/util/abilityBuilder";
import { IGetAllBaseQuery } from "../../common/interfaces/IGetAllBaseQuery";
import { GetCartsDto } from "../dto/getCartsDto";
import { Cart } from "../entities/Cart";
import { CartItem } from "../entities/CartItem";
import { ICartItemCreateFromCartModel } from "../interface/ICartItemCreateFromCart";
import { ICartRepository } from "../interface/ICartRepository";
import { ICartService } from "../interface/ICartService";

@injectable()
export class CartService extends AbstractService implements ICartService {
    constructor(
        @inject(TYPES.Cart.Repository) private cartRepository: ICartRepository
    ) {
        super()
    }

    async getCarts(queryParams: IGetAllBaseQuery, user: IUserWithAuthorization): Promise<GetCartsDto> {
        ForbiddenError.from<appAbility>(user.role.permissions).throwUnlessCan('read', 'all')
        return await this.cartRepository.getAll(queryParams)
    }

    async getCart(cartId: number, user: IUserWithAuthorization): Promise<Cart> {
        const ADMIN_ROLE_NAME: IRoleName = "ADMIN"
        const currentUserRole = user.role.name
        let cart: Cart
        if (currentUserRole === ADMIN_ROLE_NAME) {
            cart = await this.cartRepository.getCart(cartId)
        } else {
            cart = await this.cartRepository.getCart(cartId, user.id)
            ForbiddenError.from<appAbility>(user.role.permissions).throwUnlessCan('read', cart)
        }
        return cart
    }

    async addCartItem(cartId: number, newCartItem: ICartItemCreateFromCartModel, user: IUserWithAuthorization): Promise<Cart> {
        const cart = await this.cartRepository.getCart(cartId, user.id)
        const { permissions } = user.role
        ForbiddenError.from<appAbility>(permissions).throwUnlessCan('update', cart)
        const foundItem = cart.cartItems?.find(x => x.product_id === newCartItem.product_id)
        if (foundItem) {
            const cartItemId = foundItem.id
            const { quantity } = newCartItem
            await this._modifyCartItemQuantity(cartId, cartItemId, quantity)
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

    async clearCartItems(cartId: number, user: IUserWithAuthorization): Promise<void> {
        const cart = await this.cartRepository.getCart(cartId, user.id)
        ForbiddenError.from<appAbility>(user.role.permissions).throwUnlessCan('delete', cart)
        await this.cartRepository.removeAllItemsFromCart(cartId)
    }

    private async _modifyCartItemQuantity(cartId: number, cartItemId: number, quantity: number): Promise<CartItem> {
        await this.cartRepository.modifyCartItemQuantity(cartId, cartItemId, quantity)
        return await this.cartRepository.getCartItem(cartItemId)
    }
}



