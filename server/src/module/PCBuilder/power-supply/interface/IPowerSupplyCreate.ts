import { PWS_CERTIFICATION } from "../../../../config/constants/pcbuilder";
import { IProductCreate } from "../../../product/interfaces/IProductCreate";

export interface IPowerSupply_Product extends IPowerSupplyCreate, IProductCreate { }

export interface IPowerSupplyCreate {
    id?: number,
    watts: number
    certification: typeof PWS_CERTIFICATION[number]
    id_product?: number
}