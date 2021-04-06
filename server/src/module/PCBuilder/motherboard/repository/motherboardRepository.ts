import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractRepository } from "../../../abstractClasses/abstractRepository";
import { MotherboardModel } from "../model/motherboardModel";
import { fromDbToFullMotherboard, fromDbToMotherboard } from '../mapper/motherboardMapper'
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

    async getAll(cpu_brand?: string): Promise<FullMotherboard[]> {
        const findParams = cpu_brand ? { where: { cpu_brand }, include: "product" } : { include: "product" }
        const response = await this.motherboardModel.findAll(findParams);
        return response.map(fromDbToFullMotherboard)
    }

    async createMotherboard(product: Product, motherboard: Motherboard): Promise<FullMotherboard | Error> {
        const transaction = await this.ORM.transaction()
        try {
            const newProduct = await this.productModel.create(product, { transaction, isNewRecord: true });
            const id_product = newProduct.getDataValue("id")
            const myMotherboard = new Motherboard({ ...motherboard, id_product })
            const createdMotherboard = await this.motherboardModel.create(myMotherboard, { transaction, isNewRecord: true, include: "product" })
            transaction.commit()
            const response = fromDbToFullMotherboard(createdMotherboard)
            return response
        } catch (err) {
            console.log(err)
            throw new Error(err.message)
        }
    }

    async modifyMotherboard(motherboard: Motherboard): Promise<Motherboard | Error> {
        try {
            const [motherboardEdited, motherboardArray] = await this.motherboardModel.update(motherboard, { where: { id: motherboard.id }, returning: true })
            // update returns an array, first argument is the number of elements updated in the
            // database. Second argument are the array of elements. Im updating by id so there is only 
            // one element in the array.
            if (!motherboardEdited) {
                throw new Error('Motherboard not found')
            }
            console.log(motherboardArray)
            const modifiedProduct = motherboardArray[0]
            return fromDbToMotherboard(modifiedProduct)
        } catch (err) {
            throw new Error(err.message)
        }
    }

    async deleteMotherboard(id: number): Promise<true | Error> {

        try {
            const response = await this.motherboardModel.destroy({ where: { id } })
            if (!response) {
                throw new Error('motherboard not found')
            }
            return true
        } catch (err) {
            throw new Error(err.message)
        }
    }
}