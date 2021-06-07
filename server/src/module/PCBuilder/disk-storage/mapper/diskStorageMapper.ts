import { DiskStorage } from "../entities/DiskStorage"
import { DiskStorageModel } from "../model/DiskStorageModel"
import { IDiskStorageCreate } from '../interface/IDiskStorageCreate'
import { fromRequestToProduct } from "../../../product/mapper/productMapper"

export const fromDbToDiskStorage = (model: DiskStorageModel): DiskStorage => {
    const diskStorage = model.toJSON() as DiskStorage
    const { mbs, total_storage, type, watts, id, id_product, product } = diskStorage
    const diskStorageProduct = product ? fromRequestToProduct(product) : undefined
    return new DiskStorage(total_storage, type, mbs, watts, id, id_product, diskStorageProduct)
}

export const fromRequestToDiskStorage = (request: IDiskStorageCreate): DiskStorage => {
    const { mbs, id_product, id, watts, total_storage, type } = request
    return new DiskStorage(total_storage, type, mbs, watts, id, id_product, undefined)
}