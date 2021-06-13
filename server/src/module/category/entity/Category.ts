import { ICategory } from "../interfaces/ICategory";

export class Category implements ICategory {
    static readonly modelName = 'Category'
    constructor(
        public name: string,
        public id?: number
    ) { }
}