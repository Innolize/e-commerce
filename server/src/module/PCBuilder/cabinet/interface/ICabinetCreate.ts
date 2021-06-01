import { SIZE } from "../../../../config/constants/pcbuilder";
import { IProductCreate } from "../../../product/interfaces/IProductCreate";

export interface ICabinet_Product extends ICabinetCreate, IProductCreate { }

export interface ICabinetCreate {
    id?: number,
    size: typeof SIZE,
    generic_pws: boolean,
    id_product: number
}