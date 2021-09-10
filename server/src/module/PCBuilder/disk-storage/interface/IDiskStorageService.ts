import { Product } from "../../../product/entity/Product";
import { GetDiskStorageDto } from "../dto/getDiskStorageDto";
import { GetDiskStorageReqDto } from "../dto/getDiskStorageReqDto";
import { DiskStorage } from "../entities/DiskStorage";

export interface IDiskStorageService {
    getDisks(query: GetDiskStorageReqDto): Promise<GetDiskStorageDto>
    getSingleDisk(id: number): Promise<DiskStorage>
    createDisk(product: Product, disk: DiskStorage): Promise<DiskStorage>
    modifyDisk(id: number, disk: DiskStorage): Promise<DiskStorage>
    deleteDisk(id: number): Promise<true>
}