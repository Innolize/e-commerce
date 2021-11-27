import { DiskStorage } from "../entities/DiskStorage"
// import { IDiskStorageCreate } from '../interface/IDiskStorageCreate'
import { fromDbToProduct } from "../../../product/mapper/productMapper"
import { IDiskStorage } from "../interface/IDiskStorage"
import { IDiskStorageCreate, IDiskStorage_Product } from "../interface/IDiskStorageCreate"

export const fromDbToDiskStorage = (model: IDiskStorage): DiskStorage => {
    const { mbs, total_storage, type, watts, id, id_product, product } = model
    const diskStorageProduct = product ? fromDbToProduct(product) : undefined
    return new DiskStorage(total_storage, type, mbs, watts, id_product, id, diskStorageProduct)
}

// export const fromRequestToDiskStorage = (request: IDiskStorageCreate): DiskStorage => {
//     const { mbs, id_product, watts, total_storage, type } = request
//     return new DiskStorage(total_storage, type, mbs, watts, id_product, undefined, undefined)
// }

export const fromRequestToDiskStorageCreate = (request: IDiskStorage_Product): IDiskStorageCreate => {
    const { mbs, id_product, watts, total_storage, type, product } = request
    return { total_storage, type, mbs, watts, id_product, product }
}