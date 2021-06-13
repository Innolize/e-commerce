import { PWS_CERTIFICATION } from "../../../../config/constants/pcbuilder";
import { Product } from "../../../product/entity/Product";

export interface IPowerSupply {
    watts: number,
    certification: typeof PWS_CERTIFICATION[number],
    id_product: number,
    id?: number,
    product?: Product
}

