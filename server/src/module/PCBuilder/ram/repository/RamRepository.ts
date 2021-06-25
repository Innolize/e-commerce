import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractRepository } from "../../../abstractClasses/abstractRepository";
import { Op, Sequelize, WhereOptions } from "sequelize";
import { ProductModel } from "../../../product/module";
import { Product } from "../../../product/entity/Product";
import { RamModel } from "../model/ramModel";
import { fromDbToRam, fromRequestToRam } from "../mapper/ramMapper";
import { Ram } from "../entities/Ram";
import { RamError } from "../error/RamError";
import { GetRamsReqDto } from "../dto/getRamsReqDto";
import { GetRamsDto } from "../dto/getRamsDto";

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

    async getRams(queryParams: GetRamsReqDto): Promise<GetRamsDto> {
        const { ram_version, min_frec, max_frec, offset, limit } = queryParams
        const whereOptions: WhereOptions<Ram> = {}
        min_frec ? whereOptions.min_frec = { [Op.gte]: min_frec } : ''
        max_frec ? whereOptions.max_frec = { [Op.lte]: max_frec } : ''
        ram_version ? whereOptions.ram_version = ram_version : ''
        const { rows, count } = await this.ramModel.findAndCountAll({ where: whereOptions, limit, offset, include: { association: RamModel.associations.product, include: [{ association: ProductModel.associations.brand }, { association: ProductModel.associations.category }] } });
        const rams = rows.map(fromDbToRam)
        const response = new GetRamsDto(count, rams)
        return response
    }

    async getSingleRam(id: number): Promise<Ram | Error> {
        const response = await this.ramModel.findByPk(id, { include: { association: RamModel.associations.product, include: [{ association: ProductModel.associations.brand }, { association: ProductModel.associations.category }] } })
        if (!response) {
            throw RamError.notFound()
        }
        const ram = fromDbToRam(response)
        return ram
    }

    async createRam(product: Product, ram: Ram): Promise<Ram | Error> {
        const transaction = await this.ORM.transaction()
        const newProduct = await this.productModel.create(product, { transaction, isNewRecord: true });
        const id_product = newProduct.getDataValue("id") as number
        const newRam = fromRequestToRam({ ...ram, id_product })
        const createdRam = await this.ramModel.create(newRam, { transaction, isNewRecord: true })
        transaction.commit()
        const response = fromDbToRam(createdRam)
        return response
    }

    async modifyRam(id: number, ram: Ram): Promise<Ram | Error> {
        const [ramEdited, ramArray] = await this.ramModel.update(ram, { where: { id }, returning: true })
        // update returns an array, first argument is the number of elements updated in the
        // database. Second argument are the array of elements. Im updating by id so there is only 
        // one element in the array.
        if (!ramEdited) {
            throw RamError.notFound()
        }
        const modifiedRam = ramArray[0]
        return fromDbToRam(modifiedRam)
    }

    async deleteRam(id: number): Promise<true | Error> {
        const response = await this.ramModel.destroy({ where: { id } })
        if (!response) {
            throw RamError.notFound()
        }
        return true
    }
}