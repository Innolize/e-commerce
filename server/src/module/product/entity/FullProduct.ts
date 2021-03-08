import { Brand } from '../../brand/entity/Category';
import { Category } from '../../category/entity/Category';

export interface IFullProduct {
    id: number;
    name: string;
    image: string | null;
    description: string | null;
    price: number;
    stock: boolean;
    category: Category;
    brand: Brand
}

export class FullProduct {
    id: number;
    name: string;
    image: string | null;
    description: string | null;
    price: number;
    stock: boolean;
    category: Category
    brand: Brand;
    constructor({ id, name, brand, image, description, price, stock, category }: IFullProduct) {
        this.id = id,
        this.name = name,
            this.image = image,
            this.description = description,
            this.price = price,
            this.stock = stock,
            this.category = category,
            this.brand = brand
    }
}