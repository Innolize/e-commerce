import { Category } from "../entity/Category";

export class GetCategoriesDto {
    constructor(
        public count: number,
        public results: Category[]
    ) { }
}