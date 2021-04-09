import { IRamCreate } from "./IRamCreate";


export interface IRamEdit extends IRamCreate {
    id: number,
    product_id: number
}