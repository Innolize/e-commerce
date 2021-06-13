import { DISK_TYPE } from '../../../../config/constants/pcbuilder'
import { Product } from '../../../product/entity/Product'
import { IDiskStorage } from '../interface/IDiskStorage'

export class DiskStorage implements IDiskStorage {
    static readonly modelName = 'DiskStorage'
    constructor(
        public total_storage: number,
        public type: typeof DISK_TYPE[number],
        public mbs: number,
        public watts: number,
        public id_product: number,
        public id?: number,
        public product?: Product
    ) { }
}