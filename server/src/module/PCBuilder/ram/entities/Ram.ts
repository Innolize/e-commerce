import { RAM_VERSION } from '../../../../config/constants/pcbuilder'
import { Product } from '../../../product/entity/Product'

export class Ram {
    static readonly modelName = 'Ram'
    constructor(
        public ram_version: typeof RAM_VERSION[number],
        public memory: number,
        public min_frec: number,
        public max_frec: number,
        public watts: number,
        public id_product: number,
        public id?: number,

        public product?: Product
    ) { }
}