import { CPU_BRANDS, DISK_TYPE } from "../../../../config/constants/pcbuilder";

export class GetMotherboardReqDto {
    constructor(
        public limit: number = 20,
        public offset: number = 0,
        public cpu_brand?: typeof CPU_BRANDS[number]
    ) { }
}