import { PWS_CERTIFICATION } from "../../../../config/constants/pcbuilder"
import { Product } from "../../../product/entity/Product"
import { IPowerSupply } from "../interface/IPowerSupply"

export class FullPowerSupply {
    id: number
    watts: number
    certification: typeof PWS_CERTIFICATION
    product?: Product
    constructor({ id, watts, certification, product }: IPowerSupply) {
        this.id = id,
            this.watts = watts,
            this.certification = certification
        if (product) {
            this.product = new Product(product)
        }
    }
}