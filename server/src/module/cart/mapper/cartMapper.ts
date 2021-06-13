import { fromRequestToProduct } from "../../product/mapper/productMapper"
import { Cart } from "../entities/Cart"
import { CartItem } from "../entities/CartItem"
import { ICartCreate } from "../interface/ICartCreate"
import { ICartItemCreate } from "../interface/ICartItemCreate"
import { CartItemModel } from "../model/CartItemModel"
import { CartModel } from "../model/CartModel"

export const fromDbToCartItem = (model: CartItemModel): CartItem => {
    const cartItem = model.toJSON() as CartItem
    const { cart_id, quantity, product_id, id, product } = cartItem
    const cartItemProduct = product ? fromRequestToProduct(product) : undefined
    return new CartItem(product_id, quantity, cart_id, id, cartItemProduct)
}

export const fromDbToCart = (model: CartModel): Cart => {
    const { active, cartItems, id, user_id } = model
    const cartItemsArray = cartItems ? cartItems.map(item => fromRequestToCartItem(item)) : undefined
    return new Cart(user_id, active, cartItemsArray, id)
}

export const fromRequestToCartItem = (request: ICartItemCreate): CartItem => {
    const { cart_id, product_id, quantity } = request
    return new CartItem(product_id, quantity, cart_id)
}

export const fromRequestToCart = (request: ICartCreate): Cart => {
    const { user_id, id, cartItems, active } = request
    const cart_cartItem = cartItems ? cartItems.map(item => fromRequestToCartItem(item)) : undefined
    return new Cart(user_id, active, cart_cartItem, id)
}

