import { PWS_CERTIFICATION } from '../../../../config/constants/pcbuilder'
import { IPowerSupplyCreate } from '../interface/IPowerSupplyCreate'

export class PowerSupply {
    static readonly modelName = 'PowerSupply'
    id?: number
    watts: number
    certification: typeof PWS_CERTIFICATION
    id_product?: number
    constructor({ id, id_product, certification, watts }: IPowerSupplyCreate) {
        if (id) {
            this.id = id
        }
        this.watts = watts,
            this.certification = certification
        if (id_product) {
            this.id_product = id_product
        }
    }
}