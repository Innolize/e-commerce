import { PWS_CERTIFICATION } from "../../../../config/constants/pcbuilder";
import { Product } from "../../../product/entity/Product";

export interface IPowerSupply {
    id: number,
    watts: number
    certification: typeof PWS_CERTIFICATION,
    product?: Product
}

