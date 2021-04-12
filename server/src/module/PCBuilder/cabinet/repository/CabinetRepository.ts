import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractRepository } from "../../../abstractClasses/abstractRepository";
import { Sequelize } from "sequelize";
import { ProductModel } from "../../../product/module";
import { Product } from "../../../product/entity/Product";
import { FullCabinet } from "../entities/FullCabinet";
import { CabinetModel } from "../model/CabinetModel";
import { fromDbToCabinet, fromDbToFullCabinet } from "../mapper/cabinetMapper";
import { ICabinetQuery } from "../interface/ICabinetQuery";
import { Cabinet } from "../entities/Cabinet";

@injectable()
export class CabinetRepository extends AbstractRepository {
    private cabinetModel: typeof CabinetModel
    private productModel: typeof ProductModel
    private ORM: Sequelize

    constructor(
        @inject(TYPES.PCBuilder.Cabinet.Model) cabinetModel: typeof CabinetModel,
        @inject(TYPES.Common.Database) ORM: Sequelize,
        @inject(TYPES.Product.Model) productModel: typeof ProductModel
    ) {
        super()
        this.cabinetModel = cabinetModel
        this.productModel = productModel
        this.ORM = ORM
    }

    async getCabinets(query?: ICabinetQuery): Promise<FullCabinet[]> {
        const queryParams: {
            size?: unknown
        } = {}
        if (query?.size) {
            queryParams.size = query.size
        }
        console.log(queryParams)
        const response = await this.cabinetModel.findAll({ where: queryParams, include: "product" });
        return response.map(fromDbToFullCabinet)
    }

    async getSingleCabinet(id: number): Promise<FullCabinet | Error> {
        try {
            const response = await this.cabinetModel.findByPk(id, { include: 'product' })
            if (!response) {
                throw new Error('Cabinet not found')
            }
            const ram = fromDbToFullCabinet(response)
            return ram
        } catch (err) {
            throw new Error(err.message)
        }


    }

    async createCabinet(product: Product, cabinet: Cabinet): Promise<FullCabinet | Error> {
        const transaction = await this.ORM.transaction()
        try {
            const newProduct = await this.productModel.create(product, { transaction, isNewRecord: true });
            const id_product = newProduct.getDataValue("id")
            const newCabinet = new Cabinet({ ...cabinet, id_product })
            const createdRam = await this.cabinetModel.create(newCabinet, { transaction, isNewRecord: true, include: "product" })
            transaction.commit()
            const response = fromDbToFullCabinet(createdRam)
            return response
        } catch (err) {
            throw new Error(err.message)
        }
    }

    async modifyCabinet(id: number, cabinet: Cabinet): Promise<Cabinet | Error> {
        try {
            const [editedCabinet, ramArray] = await this.cabinetModel.update(cabinet, { where: { id }, returning: true })
            // update returns an array, first argument is the number of elements updated in the
            // database. Second argument are the array of elements. Im updating by id so there is only 
            // one element in the array.
            if (!editedCabinet) {
                throw new Error('Cabinet not found')
            }
            const modifiedRam = ramArray[0]
            return fromDbToCabinet(modifiedRam)
        } catch (err) {
            throw new Error(err.message)
        }
    }

    async deleteCabinet(id: number): Promise<true | Error> {

        try {
            const response = await this.cabinetModel.destroy({ where: { id } })
            if (!response) {
                throw new Error('Cabinet not found')
            }
            return true
        } catch (err) {
            throw new Error(err.message)
        }
    }
}