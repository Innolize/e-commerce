import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractRepository } from "../../../abstractClasses/abstractRepository";
import { Sequelize, WhereOptions } from "sequelize";
import { ProductModel } from "../../../product/module";
import { Product } from "../../../product/entity/Product";
import { CabinetModel } from "../model/CabinetModel";
import { fromDbToCabinet, fromRequestToCabinet } from "../mapper/cabinetMapper";
import { ICabinetQuery } from "../interface/ICabinetQuery";
import { Cabinet } from "../entities/Cabinet";
import { ICabinetEdit } from "../interface/ICabinetEdit";
import { CabinetError } from "../error/CabinetError";

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

    async getCabinets(query?: ICabinetQuery): Promise<Cabinet[]> {
        try {
            const queryParams: WhereOptions<Cabinet> = {}
            if (query?.size) {
                queryParams.size = query.size
            }
            const response = await this.cabinetModel.findAll({ where: queryParams, include: [CabinetModel.associations.product] });
            return response.map(fromDbToCabinet)
        } catch (err) {
            throw err
        }

    }

    async getSingleCabinet(id: number): Promise<Cabinet | Error> {
        try {
            const response = await this.cabinetModel.findByPk(id, { include: [CabinetModel.associations.product] })
            if (!response) {
                throw CabinetError.notFound()
            }
            const ram = fromDbToCabinet(response)
            return ram
        } catch (err) {
            throw err
        }


    }

    async createCabinet(product: Product, cabinet: Cabinet): Promise<Cabinet | Error> {
        const transaction = await this.ORM.transaction()
        try {
            const newProduct = await this.productModel.create(product, { transaction, isNewRecord: true });
            const id_product = newProduct.getDataValue("id") as number
            const newCabinet = fromRequestToCabinet({ ...cabinet, id_product })
            const createdCabinet = await this.cabinetModel.create(newCabinet, { transaction, isNewRecord: true })
            transaction.commit()
            const response = fromDbToCabinet(createdCabinet)
            return response
        } catch (err) {
            throw err
        }
    }

    async modifyCabinet(id: number, cabinet: ICabinetEdit): Promise<Cabinet | Error> {
        try {
            const [editedCabinet, ramArray] = await this.cabinetModel.update(cabinet, { where: { id }, returning: true })
            // update returns an array, first argument is the number of elements updated in the
            // database. Second argument are the array of elements. Im updating by id so there is only 
            // one element in the array.
            if (!editedCabinet) {
                throw CabinetError.notFound()
            }
            const modifiedRam = ramArray[0]
            return fromDbToCabinet(modifiedRam)
        } catch (err) {
            throw err
        }
    }

    async deleteCabinet(id: number): Promise<true | Error> {
        try {
            const response = await this.cabinetModel.destroy({ where: { id } })
            if (!response) {
                throw CabinetError.notFound()
            }
            return true
        } catch (err) {
            throw err
        }
    }
}