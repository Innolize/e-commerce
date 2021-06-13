import { IGetAllBaseQuery } from "../../common/interfaces/IGetAllBaseQuery";

export interface ICartGetAllQuery extends IGetAllBaseQuery{
    userId?: number
}