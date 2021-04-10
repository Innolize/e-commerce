import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractRepository } from "../../../abstractClasses/abstractRepository";
import { Op, Sequelize } from "sequelize";
import { ProductModel } from "../../../product/module";
import { Product } from "../../../product/entity/Product";
import { ProcessorModel } from "../model/ProcessorModel";
import { fromDbToFullProcessor, fromDbToProcessor } from "../mapper/processorMapper";
import { Processor } from "../entities/Processor";
import { FullProcessor } from '../entities/FullProcessor'
import { IProcessorQuery } from "../interface/IProcessorQuery";

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

    async getProcessor(query?: IProcessorQuery): Promise<FullProcessor[]> {
        const queryParams: {
            socket?: unknown,
        } = {}
        if (query?.socket) {
            queryParams.socket = query.socket
        }
        const response = await this.processorModel.findAll({ where: queryParams, include: "product" });
        return response.map(fromDbToFullProcessor)
    }

    async getSingleProcessor(id: number): Promise<FullProcessor | Error> {
        try {
            const response = await this.processorModel.findByPk(id, { include: 'product' })
            if (!response) {
                throw new Error('Processor not found')
            }
            const ram = fromDbToFullProcessor(response)
            return ram
        } catch (err) {
            throw new Error(err.message)
        }


    }

    async createProcessor(product: Product, ram: Processor): Promise<FullProcessor | Error> {
        const transaction = await this.ORM.transaction()
        try {
            const newProduct = await this.productModel.create(product, { transaction, isNewRecord: true });
            const id_product = newProduct.getDataValue("id")
            const newRam = new Processor({ ...ram, id_product })
            const createdRam = await this.processorModel.create(newRam, { transaction, isNewRecord: true, include: "product" })
            transaction.commit()
            const response = fromDbToFullProcessor(createdRam)
            return response
        } catch (err) {
            throw new Error(err.message)
        }
    }

    async modifyProcessor(id: number, ram: Processor): Promise<Processor | Error> {
        try {
            const [ramEdited, ramArray] = await this.processorModel.update(ram, { where: { id }, returning: true })
            // update returns an array, first argument is the number of elements updated in the
            // database. Second argument are the array of elements. Im updating by id so there is only 
            // one element in the array.
            if (!ramEdited) {
                throw new Error('Ram not found')
            }
            const modifiedRam = ramArray[0]
            return fromDbToProcessor(modifiedRam)
        } catch (err) {
            throw new Error(err.message)
        }
    }

    async deleteProcessor(id: number): Promise<true | Error> {

        try {
            const response = await this.processorModel.destroy({ where: { id } })
            if (!response) {
                throw new Error('Processor not found')
            }
            return true
        } catch (err) {
            throw new Error(err.message)
        }
    }
}