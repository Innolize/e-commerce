import { RAM_VERSION } from "../../../../config/constants/pcbuilder";

export class GetRamsReqDto {
    constructor(
        public limit: number = 20,
        public offset: number = 0,
        public ram_version?: typeof RAM_VERSION[number],
        public min_frec?: number,
        public max_frec?: number,
    ) { }
}