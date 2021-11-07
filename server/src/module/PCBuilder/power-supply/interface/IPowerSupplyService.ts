import { GetPowerSupplyDto } from "../dto/getPowerSupplyDto";
import { GetPowerSupplyReqDto } from "../dto/getPowerSupplyReqDto";
import { PowerSupply } from "../entities/PowerSupply";
import { IPowerSupplyCreate } from "./IPowerSupplyCreate";
import { IPowerSupplyEdit } from "./IPowerSupplyEdit";

export interface IPowerSupplyService {
    getAll: (queryParams: GetPowerSupplyReqDto) => Promise<GetPowerSupplyDto>
    getSingle: (id: number) => Promise<PowerSupply>
    create: (motherboard: IPowerSupplyCreate) => Promise<PowerSupply>
    modify: (id: number, motherboard: IPowerSupplyEdit) => Promise<PowerSupply>
    delete: (id: number) => Promise<true>
}