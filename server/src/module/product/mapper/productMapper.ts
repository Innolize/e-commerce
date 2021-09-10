import { fromDbToBrand } from '../../brand/mapper/brandMapper'
import { fromDbToCategory } from '../../category/mapper/categoryMapper'
import { Product } from '../entity/Product'
import { IProduct } from '../interfaces/IProduct'

export const fromDbToProduct = (model: IProduct): Product => {
    const { description, id_brand, id_category, image, name, price, stock, id, brand, category } = model
    const productCategory = category ? fromDbToCategory(category) : undefined
    const productBrand = brand ? fromDbToBrand(brand) : undefined
    return new Product(name, image, description, price, stock, id_category, id_brand, id || undefined, productCategory, productBrand)
}

export const fromRequestToProduct = (request: IProduct): Product => {
    const { description, id_brand, id_category, image, name, price, stock, id, brand, category } = request
    return new Product(name, image, description, price, stock, id_category, id_brand, id || undefined, category, brand)
}