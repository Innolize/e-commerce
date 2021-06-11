import { ICartItemCreate } from "./ICartItemCreate";

export type ICartItemCreateFromCartModel = Omit<ICartItemCreate, 'cart_id'>