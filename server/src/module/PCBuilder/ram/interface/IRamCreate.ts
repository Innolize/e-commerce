import { Product } from "../../../product/entity/Product";
import { IProductCreate } from "../../../product/interfaces/IProductCreate";
import { IRam } from "./IRam";

export type IRamCreate = Omit<IRam, 'id' | 'id_product'> & {
    id_product?: number
}

export type IRam_Product = IRamCreate & {
    product: Product
}

export interface IRam_Product_Form extends IRamCreate, IProductCreate { }