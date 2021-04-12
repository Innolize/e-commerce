import { ICabinetCreate } from "./ICabinetCreate";


export interface ICabinetEdit extends ICabinetCreate {
    id: number,
    product_id: number
}