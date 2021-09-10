import { Product } from "../../../product/entity/Product";
import { GetDiskStorageDto } from "../dto/getDiskStorageDto";
import { GetDiskStorageReqDto } from "../dto/getDiskStorageReqDto";
import { DiskStorage } from "../entities/DiskStorage";

export interface IDiskStorageRepository {
    getDisks: (queryParams: GetDiskStorageReqDto) => Promise<GetDiskStorageDto>
    getSingleDisk: (id: number) => Promise<DiskStorage>
    createDisk: (product: Product, diskStorage: DiskStorage) => Promise<DiskStorage>
    modifyDisk: (id: number, diskStorage: DiskStorage) => Promise<DiskStorage>
    deleteDisk: (id: number) => Promise<true>
}