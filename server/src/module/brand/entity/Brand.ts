import { IBrandCreate } from "../interfaces/IBrandCreate";

export class Brand {
    static readonly modelName = 'Brand'
    constructor(
        public name: string,
        public logo: string | null,
        public id?: number,
    ) { }
}