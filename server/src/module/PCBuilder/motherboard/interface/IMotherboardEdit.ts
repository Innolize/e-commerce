import { IMotherboardCreate } from "./IMotherboardCreate";

export interface IMotherboardEdit extends IMotherboardCreate {
    id: number,
    product_id: number
}