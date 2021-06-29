import { ForbiddenError } from "@casl/ability";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractService } from "../../abstractClasses/abstractService";
import { IUserWithAuthorization } from "../../authorization/interfaces/IUserWithAuthorization";
import { appAbility } from "../../authorization/util/abilityBuilder";
import { GetCartsDto } from "../dto/getCartsDto";
import { Cart } from "../entities/Cart";
import { CartItem } from "../entities/CartItem";
import { ICartGetAllQuery } from "../interface/ICartGetAllQuery";
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

    async getCarts(queryParams: ICartGetAllQuery, user: IUserWithAuthorization): Promise<GetCartsDto> {
        ForbiddenError.from<appAbility>(user.role).throwUnlessCan('read', 'all')
        return await this.cartRepository.getAll(queryParams)
    }

    async getCart(id: number, user: IUserWithAuthorization): Promise<Cart> {
        const cart = await this.cartRepository.getCart(id, user.id)
        ForbiddenError.from<appAbility>(user.role).throwUnlessCan('read', cart)
        return cart
    }

    async addCartItem(cartId: number, newCartItem: ICartItemCreateFromCartModel, user: IUserWithAuthorization): Promise<Cart> {
        const cart = await this.cartRepository.getCart(cartId, user.id)

        ForbiddenError.from<appAbility>(user.role).throwUnlessCan('update', cart)
        const cartItemExists = cart.cartItems?.find(x => x.product_id === newCartItem.product_id)
        if (cartItemExists) {
            const cartItemId = cartItemExists.id as number
            const { quantity } = newCartItem
            await this.modifyCartItemQuantity(cartId, cartItemId, quantity)
            const updatedCart = await this.cartRepository.getCart(cartId, user.id)
            return updatedCart
        }
        await this.cartRepository.verifyIfProductExists(newCartItem.product_id)
        await this.cartRepository.addCartItem(cartId, newCartItem)
        const updatedCart = await this.cartRepository.getCart(cartId, user.id)
        return updatedCart
    }

    async removeCartItem(cartId: number, cartItemId: number, user: IUserWithAuthorization): Promise<Cart> {
        const cart = await this.cartRepository.getCart(cartId, user.id)
        ForbiddenError.from<appAbility>(user.role).throwUnlessCan('delete', cart)
        await this.cartRepository.removeCartItem(cartId, cartItemId)
        const updatedCart = await this.cartRepository.getCart(cartId, user.id)
        return updatedCart
    }

    private async modifyCartItemQuantity(cartId: number, cartItemId: number, quantity: number): Promise<CartItem> {
        await this.cartRepository.modifyCartItemQuantity(cartId, cartItemId, quantity)
        return await this.cartRepository.getCartItem(cartItemId)
    }
}



