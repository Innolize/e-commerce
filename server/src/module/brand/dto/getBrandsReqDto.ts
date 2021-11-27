export class GetBrandsReqDto {
    constructor(
        public limit?: number,
        public offset?: number,
        public name?: string
    ) { }
}