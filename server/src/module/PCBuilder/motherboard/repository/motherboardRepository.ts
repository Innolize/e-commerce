import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractRepository } from "../../../abstractClasses/abstractRepository";
import { MotherboardModel } from "../model/motherboardModel";
import { fromDbToMotherboard, fromRequestToMotherboard } from '../mapper/motherboardMapper'
import { Sequelize, WhereOptions } from "sequelize";
import { ProductModel } from "../../../product/module";
import { Motherboard } from "../entity/Motherboard";
import { Product } from "../../../product/entity/Product";
import { MotherboardError } from "../error/MotherboardError";
import { GetMotherboardReqDto } from "../dto/getMotherboardsReqDto";
import { GetMotherboardDto } from "../dto/getMotherboardsDto";

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

    async getAll(queryParams: GetMotherboardReqDto): Promise<GetMotherboardDto> {
        const { cpu_brand, offset, limit } = queryParams
        const whereOptions: WhereOptions<Motherboard> = {}
        cpu_brand ? whereOptions.cpu_brand = cpu_brand : ''

        const { count, rows } = await this.motherboardModel.findAndCountAll({ where: whereOptions, offset, limit, include: MotherboardModel.associations.product });
        const motherboards = rows.map(fromDbToMotherboard)
        const response = new GetMotherboardDto(count, motherboards)
        return response
    }

    async getSingle(id: number): Promise<Motherboard> {
        try {
            const response = await this.motherboardModel.findOne({ where: { id }, include: MotherboardModel.associations.product })
            if (!response) {
                throw MotherboardError.notFound()
            }
            return fromDbToMotherboard(response)
        } catch (err) {
            throw err
        }
    }

    async createMotherboard(product: Product, motherboard: Motherboard): Promise<Motherboard | Error> {
        const transaction = await this.ORM.transaction()
        try {
            const newProduct = await this.productModel.create(product, { transaction, isNewRecord: true });
            const id_product = newProduct.getDataValue("id") as number
            const myMotherboard = fromRequestToMotherboard({ ...motherboard, id_product })
            const createdMotherboard = await this.motherboardModel.create(myMotherboard, { transaction, isNewRecord: true })
            transaction.commit()
            const response = fromDbToMotherboard(createdMotherboard)
            return response
        } catch (err) {
            throw err
        }
    }

    async modifyMotherboard(motherboard: Motherboard): Promise<Motherboard | Error> {
        try {
            const [motherboardEdited, motherboardArray] = await this.motherboardModel.update(motherboard, { where: { id: motherboard.id }, returning: true })
            // update returns an array, first argument is the number of elements updated in the
            // database. Second argument are the array of elements. Im updating by id so there is only 
            // one element in the array.
            if (!motherboardEdited) {
                throw MotherboardError.notFound()
            }
            const modifiedProduct = motherboardArray[0]
            return fromDbToMotherboard(modifiedProduct)
        } catch (err) {
            throw err
        }
    }

    async deleteMotherboard(id: number): Promise<true | Error> {

        try {
            const response = await this.motherboardModel.destroy({ where: { id } })
            if (!response) {
                throw MotherboardError.notFound()
            }
            return true
        } catch (err) {
            throw err
        }
    }
}