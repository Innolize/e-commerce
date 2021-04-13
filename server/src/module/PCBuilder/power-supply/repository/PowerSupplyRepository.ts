import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractRepository } from "../../../abstractClasses/abstractRepository";
import { Sequelize, Op } from "sequelize";
import { ProductModel } from "../../../product/module";
import { Product } from "../../../product/entity/Product";
import { FullPowerSupply } from "../entities/FullPowerSupply";
import { PowerSupplyModel } from "../model/PowerSupplyModel";
import { fromDbToFullPowerSupply, fromDbToPowerSupply } from "../mapper/cabinetMapper";
import { IPowerSupplyQuery } from "../interface/IPowerSupplyQuery";
import { PowerSupply } from "../entities/PowerSupply";

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

    async getPowerSupplies(query?: IPowerSupplyQuery): Promise<FullPowerSupply[]> {
        const queryParams: {
            watts?: unknown
        } = {}
        if (query?.watts) {
            queryParams.watts = {
                [Op.lte]: query.watts
            }
        }
        console.log(queryParams)
        const response = await this.powerSupplyModel.findAll({ where: queryParams, include: "product" });
        return response.map(fromDbToFullPowerSupply)
    }

    async getSinglePowerSupply(id: number): Promise<FullPowerSupply | Error> {
        try {
            const response = await this.powerSupplyModel.findByPk(id, { include: 'product' })
            if (!response) {
                throw new Error('Power supply not found')
            }
            const ram = fromDbToFullPowerSupply(response)
            return ram
        } catch (err) {
            throw new Error(err.message)
        }


    }

    async createPowerSupply(product: Product, powerSupply: PowerSupply): Promise<PowerSupply | Error> {
        const transaction = await this.ORM.transaction()
        try {
            const newProduct = await this.productModel.create(product, { transaction, isNewRecord: true });
            const id_product = newProduct.getDataValue("id")
            const newPowerSupply = new PowerSupply({ ...powerSupply, id_product })
            const createdPowerSupply = await this.powerSupplyModel.create(newPowerSupply, { transaction, isNewRecord: true })
            transaction.commit()
            const response = fromDbToPowerSupply(createdPowerSupply)
            return response
        } catch (err) {
            throw new Error(err.message)
        }
    }

    async modifyPowerSupply(id: number, powerSupply: PowerSupply): Promise<PowerSupply | Error> {
        try {
            const [editedPowerSupply, powerSupplyArray] = await this.powerSupplyModel.update(powerSupply, { where: { id }, returning: true })
            // update returns an array, first argument is the number of elements updated in the
            // database. Second argument are the array of elements. Im updating by id so there is only 
            // one element in the array.
            if (!editedPowerSupply) {
                throw new Error('Power supply not found')
            }
            const modifiedPowerSupply = powerSupplyArray[0]
            return fromDbToPowerSupply(modifiedPowerSupply)
        } catch (err) {
            throw new Error(err.message)
        }
    }

    async deletePowerSupply(id: number): Promise<true | Error> {

        try {
            const response = await this.powerSupplyModel.destroy({ where: { id } })
            if (!response) {
                throw new Error('Power supply not found')
            }
            return true
        } catch (err) {
            throw new Error(err.message)
        }
    }
}