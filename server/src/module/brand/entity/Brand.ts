import { IBrand } from "../interfaces/IBrand";

export class Brand implements IBrand {
    static readonly modelName = 'Brand'
    constructor(
        public name: string,
        public logo: string | null,
        public id?: number,
    ) { }
}