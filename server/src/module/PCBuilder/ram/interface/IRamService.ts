import { GetRamDto } from "../dto/getRamDto";
import { GetRamReqDto } from "../dto/getRamReqDto";
import { Ram } from "../entities/Ram";
import { IRamCreate } from "./IRamCreate";
import { IRamEdit } from "./IRamEdit";

export interface IRamService {
    getAll: (queryParams: GetRamReqDto) => Promise<GetRamDto>
    getSingle: (id: number) => Promise<Ram>
    create: (ram: IRamCreate) => Promise<Ram>
    modify: (id: number, ram: IRamEdit) => Promise<Ram>
    delete: (id: number) => Promise<true>
}