import { IPowerSupplyCreate } from "./IPowerSupplyCreate";


export interface IPowerSupplyEdit extends IPowerSupplyCreate {
    id: number,
    product_id: number
}