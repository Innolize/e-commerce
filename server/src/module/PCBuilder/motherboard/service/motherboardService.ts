import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractService } from "../../../abstractClasses/abstractService";
import { Product } from "../../../product/entity/Product";
import { GetMotherboardDto } from "../dto/getMotherboardsDto";
import { GetMotherboardReqDto } from "../dto/getMotherboardsReqDto";
import { Motherboard } from "../entity/Motherboard";
import { MotherboardRepository } from "../repository/motherboardRepository";

@injectable()
export class MotherboardService extends AbstractService {
    private motherboardRepository: MotherboardRepository;
    constructor(
        @inject(TYPES.PCBuilder.Motherboard.Repository) motherboardRepository: MotherboardRepository
    ) {
        super()
        this.motherboardRepository = motherboardRepository
    }

    getMotherboards(queryParams: GetMotherboardReqDto): Promise<GetMotherboardDto> {
        return this.motherboardRepository.getAll(queryParams)
    }

    getSingleMotherboards(id: number): Promise<Motherboard> {
        return this.motherboardRepository.getSingle(id)
    }

    async createMotherboard(product: Product, motherboard: Motherboard): Promise<Motherboard | Error> {
        return await this.motherboardRepository.createMotherboard(product, motherboard)
    }

    async modifyMotherboard(motherboard: Motherboard): Promise<Motherboard | Error> {
        return await this.motherboardRepository.modifyMotherboard(motherboard)
    }
    async deleteMotherboard(id: number): Promise<true | Error> {
        return await this.motherboardRepository.deleteMotherboard(id)
    }
}