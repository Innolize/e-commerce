import { fromRequestToBrand } from '../../brand/mapper/brandMapper'
import { Category } from '../../category/entity/Category'
import { Product } from '../entity/Product'
import { IProductCreate } from '../interfaces/IProductCreate'
import { ProductModel } from "../model/productModel"

export const fromDbToProduct = (model: ProductModel): Product => {
    const product = model.toJSON() as Product
    const { description, id_brand, id_category, image, name, price, stock, id, brand, category } = product
    const productCategory = category ? new Category(category) : undefined
    const productBrand = brand ? fromRequestToBrand(brand) : undefined
    return new Product(name, image, description, price, stock, id_category, id_brand, id || undefined, productCategory, productBrand)
}

export const fromRequestToProduct = (request: IProductCreate): Product => {
    const { description, id_brand, id_category, image, name, price, stock, id } = request
    return new Product(name, image, description, price, stock, id_category, id_brand, id || undefined, undefined, undefined)
}