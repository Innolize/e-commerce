import { PWS_CERTIFICATION } from '../../../../config/constants/pcbuilder'
import { Product } from '../../../product/entity/Product'
import { IPowerSupply } from '../interface/IPowerSupply'

export class PowerSupply implements IPowerSupply {
    static readonly modelName = 'PowerSupply'
    constructor(
        public watts: number,
        public certification: typeof PWS_CERTIFICATION[number],
        public id_product: number,
        public id?: number,
        public product?: Product
    ) { }
}