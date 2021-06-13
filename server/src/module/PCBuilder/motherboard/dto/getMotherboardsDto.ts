import { Motherboard } from "../entity/Motherboard";

export class GetMotherboardDto {
    constructor(
        public count: number,
        public results: Motherboard[]
    ) { }
}