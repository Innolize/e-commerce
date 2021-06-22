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

    async getCarts(queryParams: ICartGetAllQuery): Promise<GetCartsDto> {
        return await this.cartRepository.getAll(queryParams)
    }

    async getCart(id: number, userId: number): Promise<Cart> {
        return await this.cartRepository.getCart(id, userId)
    }

    async addCartItem(cartId: number, newCartItem: ICartItemCreateFromCartModel): Promise<CartItem> {
        // user: IUserWithAuthorization
        // const cart = await this.cartRepository.getCart(cartId, user.id)
        // ForbiddenError.from<appAbility>(user.role).throwUnlessCan('update', cart)
        return await this.cartRepository.addCartItem(cartId, newCartItem)
    }

    async removeCartItem(cartId: number, cartItemId: number): Promise<boolean> {
        return await this.cartRepository.removeCartItem(cartId, cartItemId)
    }

    async modifyCartItemQuantity(cartId: number, cartItemId: number, quantity: number): Promise<CartItem> {
        await this.cartRepository.modifyCartItemQuantity(cartId, cartItemId, quantity)
        return await this.cartRepository.getCartItem(cartItemId)
    }
}



