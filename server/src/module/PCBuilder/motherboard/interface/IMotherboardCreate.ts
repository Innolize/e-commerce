import { Product } from '../../../product/entity/Product';

import { IMotherboard } from './IMotherboard';

// export interface IMotherboard_Product extends IMotherboardCreate, IProductCreate { }

export type IMotherboardCreate = Omit<IMotherboard, 'id' | 'id_product'> & {
    id_product?: number
}

export type IMotherboard_Product = IMotherboardCreate & {
    product: Product
}