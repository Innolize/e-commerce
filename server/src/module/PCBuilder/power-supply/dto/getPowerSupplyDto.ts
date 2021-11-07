import { PowerSupply } from "../entities/PowerSupply";

export class GetPowerSupplyDto {
    constructor(
        public count: number,
        public results: PowerSupply[]
    ) { }
}