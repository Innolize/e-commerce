import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractService } from "../../../abstractClasses/abstractService";
import { Product } from "../../../product/entity/Product";
import { GetRamsDto } from "../dto/getRamsDto";
import { GetRamsReqDto } from "../dto/getRamsReqDto";
import { Ram } from "../entities/Ram";
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

    async getRams(queryParams: GetRamsReqDto): Promise<GetRamsDto> {
        return await this.ramRepository.getRams(queryParams)
    }

    async getSingleRam(id: number): Promise<Ram | Error> {
        return await this.ramRepository.getSingleRam(id)
    }

    async createRam(product: Product, ram: Ram): Promise<Ram | Error> {
        return await this.ramRepository.createRam(product, ram)
    }

    async modifyRam(id: number, motherboard: Ram): Promise<Ram | Error> {
        return await this.ramRepository.modifyRam(id, motherboard)
    }
    async deleteRam(id: number): Promise<true | Error> {
        return await this.ramRepository.deleteRam(id)
    }
}