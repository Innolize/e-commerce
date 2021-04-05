import { ICreateProduct } from "../interfaces/ICreateProduct";

export class Product {
    id?: number;
    name: string;
    image: string | null;
    description: string | null;
    price: number;
    stock: boolean;
    id_category: number
    id_brand: number
    constructor({ id, name, image, description, price, stock, id_category, id_brand }: ICreateProduct) {
        if (id) {
            this.id = id
        }
        this.id = id
        this.name = name,
            this.image = image,
            this.description = description,
            this.price = price,
            this.stock = stock
        this.id_category = id_category
        this.id_brand = id_brand
    }
}