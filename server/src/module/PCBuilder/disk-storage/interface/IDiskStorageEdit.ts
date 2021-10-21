import { IDiskStorageCreate } from "./IDiskStorageCreate";

export type IDiskStorageEditProductless = Omit<IDiskStorageCreate, 'id_product'>

export type IDiskStorageEdit = Partial<IDiskStorageEditProductless>