import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractService } from "../../../abstractClasses/abstractService";
import { Product } from "../../../product/entity/Product";
import { GetProcessorDto } from "../dto/getProcessorsDto";
import { GetProcessorReqDto } from "../dto/getProcessorsReqDto";
import { Processor } from "../entities/Processor";
import { ProcessorRepository } from "../repository/ProcessorRepository";

@injectable()
export class ProcessorService extends AbstractService {
    private processorRepository: ProcessorRepository
    constructor(
        @inject(TYPES.PCBuilder.Processor.Repository) processorRepository: ProcessorRepository
    ) {
        super()
        this.processorRepository = processorRepository
    }

    async getprocessors(queryParams: GetProcessorReqDto): Promise<GetProcessorDto> {
        return await this.processorRepository.getProcessor(queryParams)
    }

    async getSingleProcessor(id: number): Promise<Processor | Error> {
        return await this.processorRepository.getSingleProcessor(id)
    }

    async createprocessors(product: Product, processor: Processor): Promise<Processor | Error> {
        return await this.processorRepository.createProcessor(product, processor)
    }

    async modifyprocessors(id: number, processor: Processor): Promise<Processor | Error> {
        return await this.processorRepository.modifyProcessor(id, processor)
    }
    async deleteprocessors(id: number): Promise<true | Error> {
        return await this.processorRepository.deleteProcessor(id)
    }
}