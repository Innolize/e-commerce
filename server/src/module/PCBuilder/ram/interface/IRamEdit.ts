import { IRamCreate } from "./IRamCreate";

export type IRamEditProductless = Omit<IRamCreate, 'id_product'>

export type IRamEdit = Partial<IRamEditProductless>