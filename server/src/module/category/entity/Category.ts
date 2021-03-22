import { ICategory } from "../interfaces/ICategory";

export class Category {
    id?: number;
    name: string;
    constructor({ id, name }: ICategory) {
        if (id) {
            this.id = id
        }
        this.name = name
    }
}