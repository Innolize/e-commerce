import { fromDbToProduct } from "../../product/mapper/productMapper"
import { Cart } from "../entities/Cart"
import { CartItem } from "../entities/CartItem"
import { ICart } from "../interface/ICart"
import { ICartItem } from "../interface/ICartItem"

export const fromDbToCartItem = (model: ICartItem): CartItem => {
    const { cart_id, quantity, product_id, id, product } = model
    const cartItemProduct = product ? fromDbToProduct(product) : undefined
    return new CartItem(id, product_id, quantity, cart_id, cartItemProduct)
}

export const fromDbToCart = (model: ICart): Cart => {
    const { cartItems, id, user_id } = model
    const cartItemsArray = cartItems ? cartItems.map(item => fromDbToCartItem(item)) : undefined
    return new Cart(id, user_id, cartItemsArray)
}