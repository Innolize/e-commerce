import { IProductCreate } from "../../../product/interfaces/IProductCreate";

export interface IProcessor_Product extends IProcessorCreate, IProductCreate { }

export interface IProcessorCreate {
    id?: number,
    cores: number,
    socket: number,
    frecuency: number,
    watts: number,
    id_product?: number
}