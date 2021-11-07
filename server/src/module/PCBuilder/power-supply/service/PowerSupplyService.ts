import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractService } from "../../../abstractClasses/abstractService";
import { GetPowerSupplyDto } from "../dto/getPowerSupplyDto";
import { GetPowerSupplyReqDto } from "../dto/getPowerSupplyReqDto";
import { PowerSupply } from "../entities/PowerSupply";
import { IPowerSupplyCreate } from "../interface/IPowerSupplyCreate";
import { IPowerSupplyEdit } from "../interface/IPowerSupplyEdit";
import { IPowerSupplyRepository } from "../interface/IPowerSupplyRepository";
import { IPowerSupplyService } from "../interface/IPowerSupplyService";

@injectable()
export class PowerSupplyService extends AbstractService implements IPowerSupplyService {
    private powerSupplyRepository: IPowerSupplyRepository
    constructor(
        @inject(TYPES.PCBuilder.PowerSupply.Repository) powerSupplyRepository: IPowerSupplyRepository
    ) {
        super()
        this.powerSupplyRepository = powerSupplyRepository
    }

    async getAll(queryParams: GetPowerSupplyReqDto): Promise<GetPowerSupplyDto> {
        return await this.powerSupplyRepository.getAll(queryParams)
    }

    async getSingle(id: number): Promise<PowerSupply> {
        return await this.powerSupplyRepository.getSingle(id)
    }

    async create(powerSupply: IPowerSupplyCreate): Promise<PowerSupply> {
        return await this.powerSupplyRepository.create(powerSupply)
    }

    async modify(id: number, powerSupply: IPowerSupplyEdit): Promise<PowerSupply> {
        return await this.powerSupplyRepository.modify(id, powerSupply)
    }
    async delete(id: number): Promise<true> {
        return await this.powerSupplyRepository.delete(id)
    }
}