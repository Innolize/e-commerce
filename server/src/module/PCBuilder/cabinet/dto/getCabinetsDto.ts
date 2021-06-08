import { Cabinet } from "../entities/Cabinet";

export class GetCabinetsDto {
    constructor(
        public count: number,
        public results: Cabinet[]
    ) { }
}