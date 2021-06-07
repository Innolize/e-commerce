import { IProcessorCreate } from "./IProcessorCreate";


export interface IProcessorEdit extends IProcessorCreate {
    id: number,
    product_id: number
}