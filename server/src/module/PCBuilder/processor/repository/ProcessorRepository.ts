import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractRepository } from "../../../abstractClasses/abstractRepository";
import { Sequelize } from "sequelize";
import { ProductModel } from "../../../product/module";
import { Product } from "../../../product/entity/Product";
import { ProcessorModel } from "../model/ProcessorModel";
import { fromDbToProcessor, fromRequestToProcessor } from "../mapper/processorMapper";
import { Processor } from "../entities/Processor";
import { WhereOptions } from "sequelize";
import { ProcessorError } from "../error/ProcessorError";
import { GetProcessorReqDto } from "../dto/getProcessorsReqDto";
import { GetProcessorDto } from "../dto/getProcessorsDto";

@injectable()
export class ProcessorRepository extends AbstractRepository {
    private processorModel: typeof ProcessorModel
    private productModel: typeof ProductModel
    private ORM: Sequelize

    constructor(
        @inject(TYPES.PCBuilder.Processor.Model) processorModel: typeof ProcessorModel,
        @inject(TYPES.Common.Database) ORM: Sequelize,
        @inject(TYPES.Product.Model) productModel: typeof ProductModel
    ) {
        super()
        this.processorModel = processorModel
        this.productModel = productModel
        this.ORM = ORM
    }

    async getProcessor(queryParams: GetProcessorReqDto): Promise<GetProcessorDto> {
        const { offset, limit, socket } = queryParams
        const whereOptions: WhereOptions<Processor> = {}
        socket ? whereOptions.socket = socket : ''
        const { count, rows } = await this.processorModel.findAndCountAll({ where: whereOptions, offset, limit, include: { association: ProcessorModel.associations.product, include: [{ association: ProductModel.associations.brand }, { association: ProductModel.associations.category }] } });
        const processors = rows.map(fromDbToProcessor)
        const response = new GetProcessorDto(count, processors)
        return response
    }

    async getSingleProcessor(id: number): Promise<Processor | Error> {
        const response = await this.processorModel.findByPk(id, { include: { association: ProcessorModel.associations.product, include: [{ association: ProductModel.associations.brand }, { association: ProductModel.associations.category }] } })
        if (!response) {
            throw ProcessorError.notFound()
        }
        return fromDbToProcessor(response)
    }

    async createProcessor(product: Product, ram: Processor): Promise<Processor | Error> {
        const transaction = await this.ORM.transaction()
        const newProduct = await this.productModel.create(product, { transaction, isNewRecord: true });
        const id_product = newProduct.getDataValue("id") as number
        const newProcessor = fromRequestToProcessor({ ...ram, id_product })
        const createdProcessor = await this.processorModel.create(newProcessor, { transaction, isNewRecord: true })
        transaction.commit()
        const response = fromDbToProcessor(createdProcessor)
        return response
    }

    async modifyProcessor(id: number, ram: Processor): Promise<Processor | Error> {
        const [processorEdited, processorArray] = await this.processorModel.update(ram, { where: { id }, returning: true })
        // update returns an array, first argument is the number of elements updated in the
        // database. Second argument are the array of elements. Im updating by id so there is only 
        // one element in the array.
        if (!processorEdited) {
            throw ProcessorError.notFound()
        }
        const modifiedProcessor = processorArray[0]
        return fromDbToProcessor(modifiedProcessor)
    }

    async deleteProcessor(id: number): Promise<true | Error> {
        const response = await this.processorModel.destroy({ where: { id } })
        if (!response) {
            throw ProcessorError.notFound()
        }
        return true
    }
}