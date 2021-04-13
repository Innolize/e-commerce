import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractService } from "../../../abstractClasses/abstractService";
import { Product } from "../../../product/entity/Product";
import { FullPowerSupply } from "../entities/FullPowerSupply";
import { PowerSupply } from "../entities/PowerSupply";
import { IPowerSupplyQuery } from "../interface/IPowerSupplyQuery";
import { PowerSupplyRepository } from "../repository/PowerSupplyRepository";

@injectable()
export class PowerSupplyService extends AbstractService {
    private powerSupplyRepository: PowerSupplyRepository
    constructor(
        @inject(TYPES.PCBuilder.PowerSupply.Repository) powerSupplyRepository: PowerSupplyRepository
    ) {
        super()
        this.powerSupplyRepository = powerSupplyRepository
    }

    async getPowerSupply(query?: IPowerSupplyQuery): Promise<FullPowerSupply[]> {
        return await this.powerSupplyRepository.getPowerSupplies(query)
    }

    async getSinglePowerSupply(id: number): Promise<FullPowerSupply | Error> {
        return await this.powerSupplyRepository.getSinglePowerSupply(id)
    }

    async createPowerSupply(product: Product, powerSupply: PowerSupply): Promise<PowerSupply | Error> {
        return await this.powerSupplyRepository.createPowerSupply(product, powerSupply)
    }

    async modifyPowerSupply(id: number, powerSupply: PowerSupply): Promise<PowerSupply | Error> {
        return await this.powerSupplyRepository.modifyPowerSupply(id, powerSupply)
    }
    async deletePowerSupply(id: number): Promise<true | Error> {
        return await this.powerSupplyRepository.deletePowerSupply(id)
    }
}