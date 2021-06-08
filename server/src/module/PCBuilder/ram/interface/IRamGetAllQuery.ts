import { RAM_VERSION } from "../../../../config/constants/pcbuilder";

export interface IRamGetAllQuery {
    limit?: number,
    offset?: number,
    ram_version?: typeof RAM_VERSION[number],
    min_frec?: number,
    max_frec?: number,
}