import { ICategory } from "../interfaces/ICategory";

export class Category {
    static readonly modelName = 'Category'
    id?: number;
    name: string;
    constructor({ id, name }: ICategory) {
        if (id) {
            this.id = id
        }
        this.name = name
    }
}