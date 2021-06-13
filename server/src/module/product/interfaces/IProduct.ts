import { Brand } from "../../brand/entity/Brand";
import { Category } from "../../category/entity/Category";

export interface IProduct {
    name: string,
    image: string | null,
    description: string | null,
    price: number,
    stock: boolean,
    id_category: number,
    id_brand: number,
    id?: number,
    category?: Category,
    brand?: Brand
}