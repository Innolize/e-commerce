import { SIZE } from '../../../../config/constants/pcbuilder'
import { Product } from '../../../product/entity/Product'
import { ICabinet } from '../interface/ICabinet'

export class Cabinet implements ICabinet {
    static readonly modelName = 'Cabinet'
    constructor(
        public size: typeof SIZE[number],
        public generic_pws: boolean,
        public id_product: number,
        public id?: number,
        public product?: Product,
    ) {
    }
}