import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractRepository } from "../../../abstractClasses/abstractRepository";
import { ProductModel } from "../../../product/module";
import { ProcessorModel } from "../model/ProcessorModel";
import { fromDbToProcessor } from "../mapper/processorMapper";
import { Processor } from "../entities/Processor";
import { WhereOptions } from "sequelize";
import { ProcessorError } from "../error/ProcessorError";
import { GetProcessorReqDto } from "../dto/getProcessorsReqDto";
import { GetProcessorDto } from "../dto/getProcessorsDto";
import { IProcessorRepository } from "../interface/IProcessorRepository";
import { IProcessorCreate } from "../interface/IProcessorCreate";
import { IProcessorEdit } from "../interface/IProcessorEdit";

@injectable()
export class ProcessorRepository extends AbstractRepository implements IProcessorRepository {
    private processorModel: typeof ProcessorModel
    constructor(
        @inject(TYPES.PCBuilder.Processor.Model) processorModel: typeof ProcessorModel,
    ) {
        super()
        this.processorModel = processorModel
    }

    async getAll(queryParams: GetProcessorReqDto): Promise<GetProcessorDto> {
        const { offset, limit, socket } = queryParams
        const whereOptions: WhereOptions<Processor> = {}
        socket ? whereOptions.socket = socket : ''
        const { count, rows } = await this.processorModel.findAndCountAll({ where: whereOptions, offset, limit, include: { association: ProcessorModel.associations.product, include: [{ association: ProductModel.associations.brand }, { association: ProductModel.associations.category }] } });
        const processors = rows.map(fromDbToProcessor)
        const response = new GetProcessorDto(count, processors)
        return response
    }

    async getSingle(id: number): Promise<Processor> {
        const response = await this.processorModel.findByPk(id, { include: { association: ProcessorModel.associations.product, include: [{ association: ProductModel.associations.brand }, { association: ProductModel.associations.category }] } })
        if (!response) {
            throw ProcessorError.notFound()
        }
        return fromDbToProcessor(response)
    }

    async create(newProcessor: IProcessorCreate): Promise<Processor> {
        const createdProcessor = await this.processorModel.create(newProcessor, { include: ProcessorModel.associations.product })
        const response = fromDbToProcessor(createdProcessor)
        return response
    }

    async modify(id: number, processor: IProcessorEdit): Promise<Processor> {
        const [processorEdited, processorArray] = await this.processorModel.update(processor, { where: { id }, returning: true })
        // update returns an array, first argument is the number of elements updated in the
        // database. Second argument are the array of elements. Im updating by id so there is only 
        // one element in the array.
        if (!processorEdited) {
            throw ProcessorError.notFound()
        }
        const modifiedProcessor = processorArray[0]
        return fromDbToProcessor(modifiedProcessor)
    }

    async delete(id: number): Promise<true> {
        const response = await this.processorModel.destroy({ where: { id } })
        if (!response) {
            throw ProcessorError.notFound()
        }
        return true
    }
}