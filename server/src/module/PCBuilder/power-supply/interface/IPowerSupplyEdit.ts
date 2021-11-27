import { IPowerSupplyCreate } from "./IPowerSupplyCreate";

export type IPowerSupplyEditProductless = Omit<IPowerSupplyCreate, 'id_product'>

export type IPowerSupplyEdit = Partial<IPowerSupplyEditProductless>