import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractRepository } from "../../../abstractClasses/abstractRepository";
import { Op, Sequelize } from "sequelize";
import { ProductModel } from "../../../product/module";
import { Product } from "../../../product/entity/Product";
import { FullRam } from "../entities/FullRam";
import { RamModel } from "../model/ramModel";
import { fromDbToFullRam, fromDbToRam } from "../mapper/ramMapper";
import { IRamQuery } from "../interface/IRamQuery";
import { Ram } from "../entities/Ram";

@injectable()
export class RamRepository extends AbstractRepository {
    private ramModel: typeof RamModel
    private productModel: typeof ProductModel
    private ORM: Sequelize

    constructor(
        @inject(TYPES.PCBuilder.Ram.Model) ramModel: typeof RamModel,
        @inject(TYPES.Common.Database) ORM: Sequelize,
        @inject(TYPES.Product.Model) productModel: typeof ProductModel
    ) {
        super()
        this.ramModel = ramModel
        this.productModel = productModel
        this.ORM = ORM
    }

    async getRams(query?: IRamQuery): Promise<FullRam[]> {
        const queryParams: {
            min_frec?: unknown,
            max_frec?: unknown,
            ram_version?: unknown,
        } = {}
        if (query) {
            if (query.min_frec) {
                queryParams.min_frec = {
                    [Op.gte]: query.min_frec
                }
            }
            if (query.max_frec) {
                queryParams.max_frec = {
                    [Op.lte]: query.max_frec
                }
            }
            if (query.ram_version) {
                queryParams.ram_version = query.ram_version
            }
        }
        console.log(queryParams)
        const response = await this.ramModel.findAll({ where: queryParams, include: "product" });
        return response.map(fromDbToFullRam)
    }

    async getSingleRam(id: number): Promise<FullRam | Error> {
        try {
            const response = await this.ramModel.findByPk(id, { include: 'product' })
            if (!response) {
                throw new Error('Ram not found')
            }
            const ram = fromDbToFullRam(response)
            return ram
        } catch (err) {
            throw new Error(err.message)
        }


    }

    async createRam(product: Product, ram: Ram): Promise<FullRam | Error> {
        const transaction = await this.ORM.transaction()
        try {
            const newProduct = await this.productModel.create(product, { transaction, isNewRecord: true });
            const id_product = newProduct.getDataValue("id")
            const newRam = new Ram({ ...ram, id_product })
            const createdRam = await this.ramModel.create(newRam, { transaction, isNewRecord: true, include: "product" })
            transaction.commit()
            const response = fromDbToFullRam(createdRam)
            return response
        } catch (err) {
            throw new Error(err.message)
        }
    }

    async modifyRam(id: number, ram: Ram): Promise<Ram | Error> {
        try {
            const [ramEdited, ramArray] = await this.ramModel.update(ram, { where: { id }, returning: true })
            // update returns an array, first argument is the number of elements updated in the
            // database. Second argument are the array of elements. Im updating by id so there is only 
            // one element in the array.
            if (!ramEdited) {
                throw new Error('Ram not found')
            }
            const modifiedRam = ramArray[0]
            return fromDbToRam(modifiedRam)
        } catch (err) {
            throw new Error(err.message)
        }
    }

    async deleteRam(id: number): Promise<true | Error> {

        try {
            const response = await this.ramModel.destroy({ where: { id } })
            if (!response) {
                throw new Error('Ram not found')
            }
            return true
        } catch (err) {
            throw new Error(err.message)
        }
    }
}