import { SIZE } from "../../../../config/constants/pcbuilder"
import { Product } from "../../../product/entity/Product"
import { ICabinet } from "../interface/ICabinet"

export class FullCabinet {
    id: number
    size: typeof SIZE
    generic_pws: boolean
    product?: Product
    constructor({ id, generic_pws, size, product }: ICabinet) {
        this.id = id,
            this.generic_pws = generic_pws,
            this.size = size
        if (product) {
            this.product = new Product(product)
        }
    }
}