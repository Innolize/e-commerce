import { Category } from '../../category/entity/Category';

export interface IFullProduct {
    id: number;
    name: string;
    brand: string;
    image: string | null;
    description: string | null;
    price: number;
    stock: boolean;
    category: Category
}

export class FullProduct {
    id: number;
    name: string;
    brand: string;
    image: string | null;
    description: string | null;
    price: number;
    stock: boolean;
    category: Category
    constructor({ id, name, brand, image, description, price, stock, category }: IFullProduct) {
        this.id = id
        this.name = name,
            this.brand = brand,
            this.image = image,
            this.description = description,
            this.price = price,
            this.stock = stock
        this.category = category
    }
}