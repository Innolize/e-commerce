import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractService } from "../../../abstractClasses/abstractService";
import { GetMotherboardDto } from "../dto/getMotherboardsDto";
import { GetMotherboardReqDto } from "../dto/getMotherboardsReqDto";
import { Motherboard } from "../entity/Motherboard";
import { IMotherboardCreate } from "../interface/IMotherboardCreate";
import { IMotherboardEdit } from "../interface/IMotherboardEdit";
import { IMotherboardRepository } from "../interface/IMotherboardRepository";
import { IMotherboardService } from "../interface/IMotherboardService";

@injectable()
export class MotherboardService extends AbstractService implements IMotherboardService {
    private motherboardRepository: IMotherboardRepository;
    constructor(
        @inject(TYPES.PCBuilder.Motherboard.Repository) motherboardRepository: IMotherboardRepository
    ) {
        super()
        this.motherboardRepository = motherboardRepository
    }

    async getAll(queryParams: GetMotherboardReqDto): Promise<GetMotherboardDto> {
        return await this.motherboardRepository.getAll(queryParams)
    }

    async getSingle(id: number): Promise<Motherboard> {
        return await this.motherboardRepository.getSingle(id)
    }

    async create(motherboard: IMotherboardCreate): Promise<Motherboard> {
        return await this.motherboardRepository.create(motherboard)
    }

    async modify(id: number, motherboard: IMotherboardEdit): Promise<Motherboard> {
        return await this.motherboardRepository.modify(id, motherboard)
    }
    async delete(id: number): Promise<true> {
        return await this.motherboardRepository.delete(id)
    }
}