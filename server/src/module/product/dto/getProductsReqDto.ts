export class GetProductsReqDto {
    constructor(
        public limit: number = 20,
        public offset: number = 0,
        public name?: string,
        public category_id?: number
    ) { }
}