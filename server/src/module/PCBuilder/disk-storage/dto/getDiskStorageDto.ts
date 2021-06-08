import { DiskStorage } from "../entities/DiskStorage";

export class GetDiskStorageDto {
    constructor(
        public count: number,
        public results: DiskStorage[]
    ) { }
}