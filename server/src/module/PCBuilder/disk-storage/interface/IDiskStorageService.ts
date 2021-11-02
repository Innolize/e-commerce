import { GetDiskStorageDto } from "../dto/getDiskStorageDto";
import { GetDiskStorageReqDto } from "../dto/getDiskStorageReqDto";
import { DiskStorage } from "../entities/DiskStorage";
import { IDiskStorage_Product } from "./IDiskStorageCreate";

export interface IDiskStorageService {
    getDisks(query: GetDiskStorageReqDto): Promise<GetDiskStorageDto>
    getSingleDisk(id: number): Promise<DiskStorage>
    createDisk(newDiskStorage: IDiskStorage_Product): Promise<DiskStorage>
    modifyDisk(id: number, disk: DiskStorage): Promise<DiskStorage>
    deleteDisk(id: number): Promise<true>
}