import { IBrand } from "../interfaces/IBrand";

export class Brand {
    id?: number;
    name: string;
    logo: string | null;
    constructor({ id, name, logo }: IBrand) {
        if (id) {
            this.id = id
        }
        this.name = name
        this.logo = logo ? logo : null
    }
}