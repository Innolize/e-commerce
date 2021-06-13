import { fromDbToProduct, fromRequestToProduct } from "../../product/mapper/productMapper"
import { Cart } from "../entities/Cart"
import { CartItem } from "../entities/CartItem"
import { ICart } from "../interface/ICart"
import { ICartCreate } from "../interface/ICartCreate"
import { ICartItem } from "../interface/ICartItem"
import { ICartItemCreate } from "../interface/ICartItemCreate"

export const fromDbToCartItem = (model: ICartItem): CartItem => {
    const { cart_id, quantity, product_id, id, product } = model
    const cartItemProduct = product ? fromDbToProduct(product) : undefined
    return new CartItem(product_id, quantity, cart_id, id, cartItemProduct)
}

export const fromDbToCart = (model: ICart): Cart => {
    const { active, cartItems, id, user_id } = model
    const cartItemsArray = cartItems ? cartItems.map(item => fromDbToCartItem(item)) : undefined
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

