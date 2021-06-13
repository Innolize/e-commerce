import { DiskStorage } from "../entities/DiskStorage"
import { IDiskStorageCreate } from '../interface/IDiskStorageCreate'
import { fromDbToProduct } from "../../../product/mapper/productMapper"
import { IDiskStorage } from "../interface/IDiskStorage"

export const fromDbToDiskStorage = (model: IDiskStorage): DiskStorage => {
    const { mbs, total_storage, type, watts, id, id_product, product } = model
    const diskStorageProduct = product ? fromDbToProduct(product) : undefined
    return new DiskStorage(total_storage, type, mbs, watts, id_product, id, diskStorageProduct)
}

export const fromRequestToDiskStorage = (request: IDiskStorageCreate): DiskStorage => {
    const { mbs, id_product, id, watts, total_storage, type } = request
    return new DiskStorage(total_storage, type, mbs, watts, id_product, id, undefined)
}