import { ICreateProduct } from "../interfaces/ICreateProduct";


export class Product {
    id?: number;
    name: string;
    brand: string;
    image: string | null;
    description: string | null;
    price: number;
    stock: boolean;
    id_category: number
    constructor({ id, name, brand, image, description, price, stock, id_category }: ICreateProduct) {
        if (id) {
            this.id = id
        }
        this.name = name,
            this.brand = brand,
            this.image = image,
            this.description = description,
            this.price = price,
            this.stock = stock
        this.id_category = id_category
    }
}