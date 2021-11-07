import { Ram } from "../entities/Ram";

export class GetRamDto {
    constructor(
        public count: number,
        public results: Ram[]
    ) { }
}