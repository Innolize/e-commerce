import { IMotherboardCreate } from "./IMotherboardCreate";

export type IDiskStorageEditProductless = Omit<IMotherboardCreate, 'id_product'>

export type IMotherboardEdit = Partial<IDiskStorageEditProductless>