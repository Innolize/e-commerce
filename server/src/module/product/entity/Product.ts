import { Brand } from "../../brand/entity/Brand";
import { Category } from "../../category/entity/Category";

export class Product {
    static readonly modelName: 'Product';
    constructor(public name: string,
        public image: string | null,
        public description: string | null,
        public price: number,
        public stock: boolean,
        public id_category: number,
        public id_brand: number,
        public id?: number,
        public category?: Category,
        public brand?: Brand
        ) { }
}