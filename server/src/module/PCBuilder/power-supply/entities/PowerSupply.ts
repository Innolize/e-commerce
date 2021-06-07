import { PWS_CERTIFICATION } from '../../../../config/constants/pcbuilder'
import { Product } from '../../../product/entity/Product'

export class PowerSupply {
    static readonly modelName = 'PowerSupply'
    constructor(
        public watts: number,
        public certification: typeof PWS_CERTIFICATION[number],
        public id?: number,
        public id_product?: number,
        public product?: Product
    ) { }
}