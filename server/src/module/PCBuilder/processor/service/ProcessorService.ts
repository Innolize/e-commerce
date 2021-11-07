import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractService } from "../../../abstractClasses/abstractService";
import { GetProcessorDto } from "../dto/getProcessorsDto";
import { GetProcessorReqDto } from "../dto/getProcessorsReqDto";
import { Processor } from "../entities/Processor";
import { IProcessorCreate } from "../interface/IProcessorCreate";
import { IProcessorEdit } from "../interface/IProcessorEdit";
import { IProcessorRepository } from "../interface/IProcessorRepository";
import { IProcessorService } from "../interface/IProcessorService";

@injectable()
export class ProcessorService extends AbstractService implements IProcessorService {
    private processorRepository: IProcessorRepository
    constructor(
        @inject(TYPES.PCBuilder.Processor.Repository) processorRepository: IProcessorRepository
    ) {
        super()
        this.processorRepository = processorRepository
    }

    async getAll(queryParams: GetProcessorReqDto): Promise<GetProcessorDto> {
        return await this.processorRepository.getAll(queryParams)
    }

    async getSingle(id: number): Promise<Processor> {
        return await this.processorRepository.getSingle(id)
    }

    async create(processor: IProcessorCreate): Promise<Processor> {
        return await this.processorRepository.create(processor)
    }

    async modify(id: number, processor: IProcessorEdit): Promise<Processor> {
        return await this.processorRepository.modify(id, processor)
    }
    async delete(id: number): Promise<true> {
        return await this.processorRepository.delete(id)
    }
}