export class GetPowerSuppliesReqDto {
    constructor(
        public limit: number = 20,
        public offset: number = 0,
        public watts?: number
    ) { }
}