export class GetCategoriesReqDto {
    constructor(
        public limit: number = 20,
        public offset: number = 0,
        public name?: string
    ) { }
}