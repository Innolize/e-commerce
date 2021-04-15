import { FullDiskStorage } from "../entities/FullDiskStorage"
import { DiskStorage } from "../entities/DiskStorage"
import { DiskStorageModel } from "../model/DiskStorageModel"
import { IDiskStorageCreate } from '../interface/IDiskStorageCreate'

export const fromDbToFullDiskStorage = (model: DiskStorageModel): FullDiskStorage => {
    return new FullDiskStorage(model.toJSON() as FullDiskStorage)
}

export const fromDbToDiskStorage = (model: DiskStorageModel): DiskStorage => {
    return new DiskStorage(model.toJSON() as IDiskStorageCreate)
}