import { IVideoCardCreate } from "./IVideoCardCreate";

export type IVideoCardEditProductless = Omit<IVideoCardCreate, 'id_product'>

export type IVideoCardEdit = Partial<IVideoCardEditProductless>