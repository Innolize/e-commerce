import { Product } from '../../../product/entity/Product';
import { IProductCreate } from '../../../product/interfaces/IProductCreate';
import { IMotherboard } from './IMotherboard';


export type IMotherboardCreate = Omit<IMotherboard, 'id' | 'id_product'> & {
    id_product?: number
}

export type IMotherboard_Product = IMotherboardCreate & {
    product: Product
}

export interface IMotherboard_Product_Form extends IMotherboardCreate, IProductCreate { }