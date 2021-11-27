import { IGetAllBaseQuery } from "../../common/interfaces/IGetAllBaseQuery";
import { GetCartsDto } from "../dto/getCartsDto";
import { Cart } from "../entities/Cart";
import { CartItem } from "../entities/CartItem";
import { ICartItemCreateFromCartModel } from "./ICartItemCreateFromCart";

export interface ICartRepository {
    getAll: (query: IGetAllBaseQuery) => Promise<GetCartsDto>
    getCart: (id: number, userId?: number) => Promise<Cart>
    getCartItem: (id: number) => Promise<CartItem>
    addCartItem: (cartId: number, newCartItem: ICartItemCreateFromCartModel) => Promise<CartItem>
    removeCartItem: (cartId: number, ItemId: number) => Promise<boolean>
    modifyCartItemQuantity: (cartId: number, cartItemId: number, quantity: number) => Promise<boolean>
    removeAllItemsFromCart: (cartId: number) => Promise<number>
}