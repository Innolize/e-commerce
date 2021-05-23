import { SIZE } from '../../../../config/constants/pcbuilder'
import { ICabinetCreate } from '../interface/ICabinetCreate'

export class Cabinet {
    static readonly modelName = 'Cabinet'
    id?: number
    size: typeof SIZE
    generic_pws: boolean
    id_product?: number
    constructor({ id, id_product, generic_pws, size }: ICabinetCreate) {
        if (id) {
            this.id = id
        }
        this.generic_pws = generic_pws,
            this.size = size
        if (id_product) {
            this.id_product = id_product
        }
    }
}