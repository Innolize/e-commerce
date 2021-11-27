import { IProcessorCreate } from "./IProcessorCreate";

export type IProcessorEditProductless = Omit<IProcessorCreate, 'id_product'>

export type IProcessorEdit = Partial<IProcessorEditProductless>