import { SIZE } from "../../../../config/constants/pcbuilder";

export interface ICabinetGetCabinets {
    size?: typeof SIZE[number],
    limit?: number
    offset?: number
}