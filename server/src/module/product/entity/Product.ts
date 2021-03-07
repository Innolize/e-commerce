import { IProduct } from '../interfaces/IProduct'

export class Product {
    id?: number;
    name: string;
    brand: string;
    image: string | null;
    description: string | null;
    price: number;
    stock: boolean;
    constructor({ id, name, brand, image, description, price, stock }: IProduct) {
        if (id) {
            this.id = id
        }
        this.name = name,
            this.brand = brand,
            this.image = image,
            this.description = description,
            this.price = price,
            this.stock = stock

    }
}