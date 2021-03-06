import { Optional } from "sequelize/types";

export interface IProduct {
    id: number,
    name: string,
    brand: string,
    image: string | null,
    description: string | null,
    price: number,
    stock: number
}

export interface IProductOptional extends Optional<IProduct, "id">{}