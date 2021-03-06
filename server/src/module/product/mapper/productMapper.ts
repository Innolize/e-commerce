import { Model } from "sequelize/types"
import { Product } from "../entity/Product"
import { IProduct, IProductOptional } from "../interfaces/IProduct"
import ProductModel from "../model/productModel"

export const fromDbToEntity = (model: ProductModel): Product => {
    return new Product(model.toJSON() as IProduct)
}