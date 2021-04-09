import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractService } from "../../../abstractClasses/abstractService";
import { Product } from "../../../product/entity/Product";
import { FullRam } from "../entities/FullRam";
import { Ram } from "../entities/Ram";
import { IRamQuery } from "../interface/IRamQuery";
import { RamRepository } from "../repository/RamRepository";

@injectable()
export class RamService extends AbstractService {
    private ramRepository: RamRepository
    constructor(
        @inject(TYPES.PCBuilder.Ram.Repository) ramRepository: RamRepository
    ) {
        super()
        this.ramRepository = ramRepository
    }

    async getRams(query?: IRamQuery): Promise<FullRam[]> {
        return await this.ramRepository.getRams(query)
    }

    async getSingleRam(id: number): Promise<FullRam | Error> {
        return await this.ramRepository.getSingleRam(id)
    }

    async createRam(product: Product, ram: Ram): Promise<FullRam | Error> {
        return await this.ramRepository.createRam(product, ram)
    }

    async modifyRam(id: number, motherboard: Ram): Promise<Ram | Error> {
        return await this.ramRepository.modifyRam(id, motherboard)
    }
    async deleteRam(id: number): Promise<true | Error> {
        return await this.ramRepository.deleteRam(id)
    }
}