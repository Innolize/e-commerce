import { PowerSupply } from "../entities/PowerSupply";

export class GetPowerSuppliesDto {
    constructor(
        public count: number,
        public results: PowerSupply[]
    ) { }
}