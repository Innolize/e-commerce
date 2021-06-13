import { CPU_BRANDS } from "../../../../config/constants/pcbuilder";

export interface IMotherboardGetAllQueries {
    limit?: number
    offset?: number
    cpu_brand?: typeof CPU_BRANDS[number]
}