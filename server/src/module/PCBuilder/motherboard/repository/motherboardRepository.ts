import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractRepository } from "../../../abstractClasses/abstractRepository";
import { MotherboardModel } from "../model/motherboardModel";
import { fromDbToFullMotherboard } from '../mapper/motherboardMapper'
import { Sequelize } from "sequelize";
import { ProductModel } from "../../../product/module";
import { Motherboard } from "../entity/Motherboard";
import { Product } from "../../../product/entity/Product";
import { FullMotherboard } from "../entity/FullMotherboard";

@injectable()
export class MotherboardRepository extends AbstractRepository {
    private motherboardModel: typeof MotherboardModel
    private productModel: typeof ProductModel
    private ORM: Sequelize

    constructor(
        @inject(TYPES.PCBuilder.Motherboard.Model) motherboardModel: typeof MotherboardModel,
        @inject(TYPES.Common.Database) ORM: Sequelize,
        @inject(TYPES.Product.Model) productModel: typeof ProductModel
    ) {
        super()
        this.motherboardModel = motherboardModel
        this.productModel = productModel
        this.ORM = ORM

    }

    async getAll(): Promise<FullMotherboard[]> {
        const response = await this.motherboardModel.findAll({ include: "product" })
        return response.map(fromDbToFullMotherboard)
    }

    async createMotherboard(product: Product, motherboard: Motherboard): Promise<FullMotherboard | Error> {
        const transaction = await this.ORM.transaction()
        try {
            const newProduct = await this.productModel.create(product, { transaction, isNewRecord: !!product.id });
            const id_product = newProduct.getDataValue("id")
            const myMotherboard = new Motherboard({ ...motherboard, id_product })
            const createdMotherboard = await this.motherboardModel.create(myMotherboard, { transaction, isNewRecord: !!product.id, include: "product" })
            console.log("linea 42 ", createdMotherboard)
            transaction.commit()
            const response = fromDbToFullMotherboard(createdMotherboard)
            console.log("linea 45: ", response)
            return response
        } catch (err) {
            console.log(err)
            throw new Error(err.message)
        }
    }

    async editMotherboard(): Promise<string> {

        return "12345"
    }

    async deleteMotherboard(): Promise<string> {

        return "12345"
    }
}