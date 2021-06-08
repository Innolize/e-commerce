import { SIZE } from "../../../../config/constants/pcbuilder";

export class GetCabinetsReqDto {
    constructor(
        public limit: number = 20,
        public offset: number = 0,
        public size?: typeof SIZE
    ) { }
}