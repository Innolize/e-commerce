import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractService } from "../../../abstractClasses/abstractService";
import { FullRam } from "../entities/FullRam";
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
}