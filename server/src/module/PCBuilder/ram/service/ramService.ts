import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractService } from "../../../abstractClasses/abstractService";
import { GetRamDto } from "../dto/getRamDto";
import { GetRamReqDto } from "../dto/getRamReqDto";
import { Ram } from "../entities/Ram";
import { IRamCreate } from "../interface/IRamCreate";
import { IRamEdit } from "../interface/IRamEdit";
import { IRamRepository } from "../interface/IRamRepository";
import { IRamService } from "../interface/IRamService";

@injectable()
export class RamService extends AbstractService implements IRamService {
    private ramRepository: IRamRepository
    constructor(
        @inject(TYPES.PCBuilder.Ram.Repository) ramRepository: IRamRepository
    ) {
        super()
        this.ramRepository = ramRepository
    }

    async getAll(queryParams: GetRamReqDto): Promise<GetRamDto> {
        return await this.ramRepository.getAll(queryParams)
    }

    async getSingle(id: number): Promise<Ram> {
        return await this.ramRepository.getSingle(id)
    }

    async create(ram: IRamCreate): Promise<Ram> {
        return await this.ramRepository.create(ram)
    }

    async modify(id: number, ram: IRamEdit): Promise<Ram> {
        return await this.ramRepository.modify(id, ram)
    }
    async delete(id: number): Promise<true> {
        return await this.ramRepository.delete(id)
    }
}