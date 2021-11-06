import { Product } from '../../../product/entity/Product';

import { IMotherboard } from './IMotherboard';

export type IMotherboardCreate = Omit<IMotherboard, 'id' | 'id_product'> & {
    id_product?: number
}

export type IMotherboard_Product = IMotherboardCreate & {
    product: Product
}