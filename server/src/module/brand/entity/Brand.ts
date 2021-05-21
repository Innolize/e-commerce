import { IBrandCreate } from "../interfaces/IBrandCreate";

export class Brand {
    static readonly modelName = 'Brand'
    id?: number;
    name: string;
    logo: string | null;
    constructor({ id, name, logo }: IBrandCreate) {
        if (id) {
            this.id = id
        }
        this.name = name
        this.logo = logo ? logo : null
    }
}