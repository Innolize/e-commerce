import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractRepository } from "../../../abstractClasses/abstractRepository";
import { Sequelize } from "sequelize";
import { ProductModel } from "../../../product/module";
import { Product } from "../../../product/entity/Product";
import { ProcessorModel } from "../model/ProcessorModel";
import { fromDbToProcessor, fromRequestToProcessor } from "../mapper/processorMapper";
import { Processor } from "../entities/Processor";
import { IProcessorQuery } from "../interface/IProcessorQuery";
import { WhereOptions } from "sequelize";
import { ProcessorError } from "../error/ProcessorError";
import { ForeignKeyConstraintError } from "sequelize";

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

    async getProcessor(query?: IProcessorQuery): Promise<Processor[]> {
        const queryParams: WhereOptions<Processor> = {}
        if (query) {
            query.socket ? queryParams.socket = query.socket : ''
        }
        const response = await this.processorModel.findAll({ where: queryParams, include: ProcessorModel.associations.product });
        return response.map(fromDbToProcessor)
    }

    async getSingleProcessor(id: number): Promise<Processor | Error> {
        try {
            const response = await this.processorModel.findByPk(id, { include: ProcessorModel.associations.product })
            if (!response) {
                throw ProcessorError.notFound()
            }
            return fromDbToProcessor(response)
        } catch (err) {
            throw err
        }
    }

    async createProcessor(product: Product, ram: Processor): Promise<Processor | Error> {
        const transaction = await this.ORM.transaction()
        try {
            const newProduct = await this.productModel.create(product, { transaction, isNewRecord: true });
            const id_product = newProduct.getDataValue("id") as number
            const newProcessor = fromRequestToProcessor({ ...ram, id_product })
            const createdProcessor = await this.processorModel.create(newProcessor, { transaction, isNewRecord: true })
            transaction.commit()
            const response = fromDbToProcessor(createdProcessor)
            return response
        } catch (err) {
            throw err
        }
    }

    async modifyProcessor(id: number, ram: Processor): Promise<Processor | Error> {
        try {
            const [processorEdited, processorArray] = await this.processorModel.update(ram, { where: { id }, returning: true })
            // update returns an array, first argument is the number of elements updated in the
            // database. Second argument are the array of elements. Im updating by id so there is only 
            // one element in the array.
            if (!processorEdited) {
                throw ProcessorError.notFound()
            }
            const modifiedProcessor = processorArray[0]
            return fromDbToProcessor(modifiedProcessor)
        } catch (err) {
            throw err
        }
    }

    async deleteProcessor(id: number): Promise<true | Error> {

        try {
            const response = await this.processorModel.destroy({ where: { id } })
            if (!response) {
                throw ProcessorError.notFound()
            }
            return true
        } catch (err) {
            throw err
        }
    }
}