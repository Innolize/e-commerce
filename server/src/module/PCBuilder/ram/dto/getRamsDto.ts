import { Ram } from "../entities/Ram";

export class GetRamsDto {
    constructor(
        public count: number,
        public results: Ram[]
    ) { }
}