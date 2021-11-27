import { IUserWithAuthorization } from "../../authorization/interfaces/IUserWithAuthorization";
import { IGetAllBaseQuery } from "../../common/interfaces/IGetAllBaseQuery";
import { GetCartsDto } from "../dto/getCartsDto";
import { Cart } from "../entities/Cart";
import { ICartItemCreateFromCartModel } from "./ICartItemCreateFromCart";

export interface ICartService {
    getCarts: (queryParams: IGetAllBaseQuery, user: IUserWithAuthorization) => Promise<GetCartsDto>
    getCart: (id: number, user: IUserWithAuthorization) => Promise<Cart>
    addCartItem: (cartId: number, newCartItem: ICartItemCreateFromCartModel, user: IUserWithAuthorization) => Promise<Cart>
    removeCartItem: (cartId: number, cartItemId: number, user: IUserWithAuthorization) => Promise<Cart>
    clearCartItems: (cartId: number, user: IUserWithAuthorization) => Promise<void>
}