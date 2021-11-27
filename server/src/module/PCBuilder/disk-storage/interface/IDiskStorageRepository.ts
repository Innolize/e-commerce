import { GetDiskStorageDto } from "../dto/getDiskStorageDto";
import { GetDiskStorageReqDto } from "../dto/getDiskStorageReqDto";
import { DiskStorage } from "../entities/DiskStorage";
import { IDiskStorageCreate } from "./IDiskStorageCreate";
import { IDiskStorageEdit } from "./IDiskStorageEdit";

export interface IDiskStorageRepository {
    getDisks: (queryParams: GetDiskStorageReqDto) => Promise<GetDiskStorageDto>
    getSingleDisk: (id: number) => Promise<DiskStorage>
    createDisk: (newDiskStorage: IDiskStorageCreate) => Promise<DiskStorage>
    modifyDisk: (id: number, diskStorage: IDiskStorageEdit) => Promise<DiskStorage>
    deleteDisk: (id: number) => Promise<true>
}