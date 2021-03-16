import { IBrand } from "../interfaces/IBrand";

export class Brand {
    id?: number;
    name: string;
    constructor({ id, name }: IBrand) {
        if (id) {
            this.id = id
        }
        this.name = name
    }
}