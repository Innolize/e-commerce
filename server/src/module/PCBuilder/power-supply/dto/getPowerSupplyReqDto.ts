export class GetPowerSupplyReqDto {
    constructor(
        public limit: number = 20,
        public offset: number = 0,
        public watts?: number
    ) { }
}