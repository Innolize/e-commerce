import { Product } from "../../../product/entity/Product";
import { GetCabinetsDto } from "../dto/getCabinetsDto";
import { GetCabinetsReqDto } from "../dto/getCabinetsReqDto";
import { Cabinet } from "../entities/Cabinet";
import { ICabinetProductless } from "./ICabinetCreate";
import { ICabinetEdit } from "./ICabinetEdit";

export interface ICabinetService {
    getCabinets: (query: GetCabinetsReqDto) => Promise<GetCabinetsDto>
    getSingleCabinet: (id: number) => Promise<Cabinet>
    createCabinet: (product: Product, cabinet: ICabinetProductless) => Promise<Cabinet>
    modifyCabinet: (id: number, cabinet: ICabinetEdit) => Promise<Cabinet>
    deleteCabinet: (id: number) => Promise<true>
}