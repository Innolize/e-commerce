import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractService } from "../../abstractClasses/abstractService";
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
        this.test = 'pepito'
    }

    async getCarts(): Promise<Cart[]> {
        return await this.cartRepository.getAll()
    }
    async addCartItem(cartId: number, newCartItem: ICartItemCreateFromCartModel): Promise<CartItem[]> {
        return await this.cartRepository.addCartItem(cartId, newCartItem)
    }

    // function removeCartItem(): Cart {
    //     return
    // }

    // function modifyCartItem(): Cart {
    //     return
    // }
}



