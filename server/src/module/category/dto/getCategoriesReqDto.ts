export class GetCategoriesReqDto {
    constructor(
        public limit?: number,
        public offset?: number,
        public name?: string
    ) { }
}