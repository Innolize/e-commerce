import { Product } from "../../../product/entity/Product";
import { IProductCreate } from "../../../product/interfaces/IProductCreate";
import { IVideoCard } from "./IVideoCard";

export type IVideoCardCreate = Omit<IVideoCard, 'id' | 'id_product'> & {
    id_product?: number
}

export type IVideoCard_Product = IVideoCardCreate & {
    product: Product
}

export interface IVideoCard_Product_Form extends IVideoCardCreate, IProductCreate { }