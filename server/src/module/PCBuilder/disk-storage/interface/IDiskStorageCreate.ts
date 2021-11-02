import { IProductCreate } from "../../../product/interfaces/IProductCreate";
import { Product } from "../../../product/entity/Product";
import { IDiskStorage } from "./IDiskStorage";

export interface IDiskStorage_Product_Form extends IDiskStorageCreate, IProductCreate { }


export type IDiskStorageCreate = Omit<IDiskStorage, 'id' | 'id_product'> & {
    id_product?: number
}

export type IDiskStorage_Product = IDiskStorageCreate & {
    product: Product
}