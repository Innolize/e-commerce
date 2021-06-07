import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractService } from "../../../abstractClasses/abstractService";
import { Product } from "../../../product/entity/Product";
import { Processor } from "../entities/Processor";
import { IProcessorQuery } from "../interface/IProcessorQuery";
// import { IRamQuery } from "../interface/IRamQuery";
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

    async getprocessors(query?: IProcessorQuery): Promise<Processor[]> {
        return await this.processorRepository.getProcessor(query)
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