import { IMotherboardCreate } from "./IMotherboardCreate";

export type IMotherboardEditProductless = Omit<IMotherboardCreate, 'id_product'>

export type IMotherboardEdit = Partial<IMotherboardEditProductless>