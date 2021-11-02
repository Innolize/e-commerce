import { GetDiskStorageDto } from "../dto/getDiskStorageDto";
import { GetDiskStorageReqDto } from "../dto/getDiskStorageReqDto";
import { DiskStorage } from "../entities/DiskStorage";
import { IDiskStorageCreate } from "./IDiskStorageCreate";
import { IDiskStorageEdit } from "./IDiskStorageEdit";

export interface IDiskStorageService {
    getDisks(query: GetDiskStorageReqDto): Promise<GetDiskStorageDto>
    getSingleDisk(id: number): Promise<DiskStorage>
    createDisk(newDiskStorage: IDiskStorageCreate): Promise<DiskStorage>
    modifyDisk(id: number, disk: IDiskStorageEdit): Promise<DiskStorage>
    deleteDisk(id: number): Promise<true>
}