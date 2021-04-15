import { IDiskStorageCreate } from "./IDiskStorageCreate";


export interface IDiskStorageEdit extends IDiskStorageCreate {
    id: number,
    product_id: number
}