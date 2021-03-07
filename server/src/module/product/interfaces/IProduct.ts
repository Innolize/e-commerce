import { Category } from "../../category/entity/Category";

export interface IProductModel {
    id?: number;
    name: string;
    brand: string;
    image: string | null;
    description: string | null;
    price: number;
    stock: boolean;
    id_category?: number | Category
    category?: Category
}