import { Product } from "../entity/Product";

export class GetProductsDto {
    constructor(
        public count: number,
        public results: Product[]
    ) { }
}