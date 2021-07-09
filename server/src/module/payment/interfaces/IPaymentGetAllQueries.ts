import { IGetAllBaseQuery } from "../../common/interfaces/IGetAllBaseQuery";
import { PAYMENT_STATUS } from '../../../config/constants/pcbuilder'

export interface IPaymentGetAllQueries extends IGetAllBaseQuery {
    status?: typeof PAYMENT_STATUS[number]
}