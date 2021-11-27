import { Product } from "../../../product/entity/Product"
import { IProductCreate } from "../../../product/interfaces/IProductCreate"
import { IProcessor } from "./IProcessor"

export type IProcessorCreate = Omit<IProcessor, 'id' | 'id_product'> & {
    id_product?: number
}

export type IProcessor_Product = IProcessorCreate & {
    product: Product
}

export interface IProcessor_Product_Form extends IProcessorCreate, IProductCreate { }