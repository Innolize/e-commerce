import { DISK_TYPE } from '../../../../config/constants/pcbuilder'
import { Product } from '../../../product/entity/Product'
import { IDiskStorageCreate } from '../interface/IDiskStorageCreate'

export class DiskStorage {
    static readonly modelName = 'DiskStorage'
    constructor(
        public total_storage: number,
        public type: typeof DISK_TYPE,
        public mbs: number,
        public watts: number,
        public id?: number,
        public id_product?: number,
        public product?: Product
    ) { }
}