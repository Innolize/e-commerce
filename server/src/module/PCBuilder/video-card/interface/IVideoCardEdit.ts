import { IVideoCardCreate } from "./IVideoCardCreate";


export interface IVideoCardEdit extends IVideoCardCreate {
    id: number,
    product_id: number
}