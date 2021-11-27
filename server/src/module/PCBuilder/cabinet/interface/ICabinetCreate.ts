import { SIZE } from "../../../../config/constants/pcbuilder";
import { IProductCreate } from "../../../product/interfaces/IProductCreate";

export interface ICabinet_Product extends ICabinetCreate, IProductCreate { }

export type ICabinet_Create_Productless = Omit<ICabinet_Product, 'id_product'>

export interface ICabinetCreate {
    size: typeof SIZE[number],
    generic_pws: boolean,
    id_product?: number
}

export type ICabinetProductless = Omit<ICabinetCreate, 'id_product'>