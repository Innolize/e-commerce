import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractRepository } from "../../../abstractClasses/abstractRepository";
import { Sequelize, Op, WhereOptions } from "sequelize";
import { ProductModel } from "../../../product/module";
import { Product } from "../../../product/entity/Product";
import { PowerSupplyModel } from "../model/PowerSupplyModel";
import { fromDbToPowerSupply, fromRequestToPowerSupply } from "../mapper/powerSupplyMapper";
import { IPowerSupplyQuery } from "../interface/IPowerSupplyQuery";
import { PowerSupply } from "../entities/PowerSupply";
import { PowerSupplyError } from "../error/PowerSupplyError";

@injectable()
export class PowerSupplyRepository extends AbstractRepository {
    private powerSupplyModel: typeof PowerSupplyModel
    private productModel: typeof ProductModel
    private ORM: Sequelize

    constructor(
        @inject(TYPES.PCBuilder.PowerSupply.Model) powerSupplyModel: typeof PowerSupplyModel,
        @inject(TYPES.Common.Database) ORM: Sequelize,
        @inject(TYPES.Product.Model) productModel: typeof ProductModel
    ) {
        super()
        this.powerSupplyModel = powerSupplyModel
        this.productModel = productModel
        this.ORM = ORM
    }

    async getPowerSupplies(query?: IPowerSupplyQuery): Promise<PowerSupply[]> {
        const queryParams: WhereOptions<PowerSupply> = {}
        if (query) {
            query.watts ? queryParams.watts = { [Op.lte]: query.watts } : ""
        }
        const response = await this.powerSupplyModel.findAll({ where: queryParams, include: PowerSupplyModel.associations.product });
        return response.map(fromDbToPowerSupply)
    }

    async getSinglePowerSupply(id: number): Promise<PowerSupply | Error> {
        try {
            const response = await this.powerSupplyModel.findByPk(id, { include: PowerSupplyModel.associations.product })
            if (!response) {
                throw PowerSupplyError.notFound()
            }
            const powerSupply = fromDbToPowerSupply(response)
            return powerSupply
        } catch (err) {
            throw err
        }
    }

    async createPowerSupply(product: Product, powerSupply: PowerSupply): Promise<PowerSupply | Error> {
        const transaction = await this.ORM.transaction()
        try {
            const newProduct = await this.productModel.create(product, { transaction, isNewRecord: true });
            const id_product = newProduct.getDataValue("id") as number
            const newPowerSupply = fromRequestToPowerSupply({ ...powerSupply, id_product })
            const createdPowerSupply = await this.powerSupplyModel.create(newPowerSupply, { transaction, isNewRecord: true })
            transaction.commit()
            const response = fromDbToPowerSupply(createdPowerSupply)
            return response
        } catch (err) {
            throw err
        }
    }

    async modifyPowerSupply(id: number, powerSupply: PowerSupply): Promise<PowerSupply | Error> {
        try {
            const [editedPowerSupply, powerSupplyArray] = await this.powerSupplyModel.update(powerSupply, { where: { id }, returning: true })
            // update returns an array, first argument is the number of elements updated in the
            // database. Second argument are the array of elements. Im updating by id so there is only 
            // one element in the array.
            if (!editedPowerSupply) {
                throw PowerSupplyError.notFound()
            }
            const modifiedPowerSupply = powerSupplyArray[0]
            return fromDbToPowerSupply(modifiedPowerSupply)
        } catch (err) {
            throw err
        }
    }

    async deletePowerSupply(id: number): Promise<true | Error> {
        try {
            const response = await this.powerSupplyModel.destroy({ where: { id } })
            if (!response) {
                throw PowerSupplyError.notFound()
            }
            return true
        } catch (err) {
            throw err
        }
    }
}