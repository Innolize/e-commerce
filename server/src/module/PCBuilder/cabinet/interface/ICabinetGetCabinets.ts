import { SIZE } from "../../../../config/constants/pcbuilder";

export interface ICabinetGetCabinets {
    size?: typeof SIZE,
    limit?: number
    offset?: number
}