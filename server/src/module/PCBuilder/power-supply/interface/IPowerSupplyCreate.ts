import { Product } from "../../../product/entity/Product";
import { IProductCreate } from "../../../product/interfaces/IProductCreate";
import { IPowerSupply } from "./IPowerSupply";

export type IPowerSupplyCreate = Omit<IPowerSupply, 'id' | 'id_product'> & {
    id_product?: number
}

export type IPowerSupply_Product = IPowerSupplyCreate & {
    product: Product
}

export interface IPowerSupply_Product_Form extends IPowerSupplyCreate, IProductCreate { }