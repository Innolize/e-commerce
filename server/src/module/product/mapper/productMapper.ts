import { FullProduct } from '../entity/FullProduct'
import { Product } from '../entity/Product'
import { ProductModel } from "../model/productModel"

export const fromDbToProduct = (model: ProductModel): Product => {
    return new Product(model.toJSON() as Product)
}

export const fromDbToFullProduct = (model: ProductModel): FullProduct => {
    console.log(model)
    return new FullProduct(model.toJSON() as FullProduct)
}