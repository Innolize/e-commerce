import { DISK_TYPE } from "../../../../config/constants/pcbuilder";

export class GetDiskStorageReqDto {
    constructor(
        public limit: number = 20,
        public offset: number = 0,
        public type?: typeof DISK_TYPE[number]
    ) { }
}