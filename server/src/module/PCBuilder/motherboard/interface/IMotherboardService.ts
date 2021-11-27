import { GetMotherboardDto } from "../dto/getMotherboardsDto";
import { GetMotherboardReqDto } from "../dto/getMotherboardsReqDto";
import { Motherboard } from "../entity/Motherboard";
import { IMotherboardCreate } from "./IMotherboardCreate";
import { IMotherboardEdit } from "./IMotherboardEdit";

export interface IMotherboardService {
    getAll: (queryParams: GetMotherboardReqDto) => Promise<GetMotherboardDto>
    getSingle: (id: number) => Promise<Motherboard>
    create: (motherboard: IMotherboardCreate) => Promise<Motherboard>
    modify: (id: number, motherboard: IMotherboardEdit) => Promise<Motherboard>
    delete: (id: number) => Promise<true>
}