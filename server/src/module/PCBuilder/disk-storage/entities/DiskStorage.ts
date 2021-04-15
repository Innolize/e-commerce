import { DISK_TYPE } from '../../../../config/constants/pcbuilder'
import { IDiskStorageCreate } from '../interface/IDiskStorageCreate'

export class DiskStorage {
    id?: number
    total_storage: number
    type: typeof DISK_TYPE
    mbs: number
    watts: number
    id_product?: number
    constructor({ id, id_product, mbs, total_storage, type, watts }: IDiskStorageCreate) {
        if (id) {
            this.id = id
        }
        this.total_storage = total_storage,
            this.type = type,
            this.mbs = mbs,
            this.watts = watts
        if (id_product) {
            this.id_product = id_product
        }
    }
}