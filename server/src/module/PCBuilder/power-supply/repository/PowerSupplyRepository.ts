import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractRepository } from "../../../abstractClasses/abstractRepository";
import { Op, WhereOptions } from "sequelize";
import { ProductModel } from "../../../product/module";
import { PowerSupplyModel } from "../model/PowerSupplyModel";
import { fromDbToPowerSupply } from "../mapper/powerSupplyMapper";
import { PowerSupply } from "../entities/PowerSupply";
import { PowerSupplyError } from "../error/PowerSupplyError";
import { GetPowerSupplyReqDto } from "../dto/getPowerSupplyReqDto";
import { GetPowerSupplyDto } from "../dto/getPowerSupplyDto";
import { IPowerSupplyRepository } from "../interface/IPowerSupplyRepository";
import { IPowerSupplyCreate } from "../interface/IPowerSupplyCreate";
import { IPowerSupplyEdit } from "../interface/IPowerSupplyEdit";

@injectable()
export class PowerSupplyRepository extends AbstractRepository implements IPowerSupplyRepository {
    private powerSupplyModel: typeof PowerSupplyModel

    constructor(
        @inject(TYPES.PCBuilder.PowerSupply.Model) powerSupplyModel: typeof PowerSupplyModel
    ) {
        super()
        this.powerSupplyModel = powerSupplyModel
    }

    async getAll(queryParams: GetPowerSupplyReqDto): Promise<GetPowerSupplyDto> {
        const { watts, limit, offset } = queryParams
        const whereOptions: WhereOptions<PowerSupply> = {}
        watts ? whereOptions.watts = { [Op.lte]: watts } : ""
        const { rows, count } = await this.powerSupplyModel.findAndCountAll({ where: whereOptions, limit, offset, include: { association: PowerSupplyModel.associations.product, include: [{ association: ProductModel.associations.brand }, { association: ProductModel.associations.category }] } });
        const powerSupplies = rows.map(fromDbToPowerSupply)
        const response = new GetPowerSupplyDto(count, powerSupplies)
        return response
    }

    async getSingle(id: number): Promise<PowerSupply> {
        const response = await this.powerSupplyModel.findByPk(id, { include: { association: PowerSupplyModel.associations.product, include: [{ association: ProductModel.associations.brand }, { association: ProductModel.associations.category }] } })
        if (!response) {
            throw PowerSupplyError.notFound()
        }
        const powerSupply = fromDbToPowerSupply(response)
        return powerSupply
    }

    async create(newPowerSupply: IPowerSupplyCreate): Promise<PowerSupply> {
        const createdPowerSupply = await this.powerSupplyModel.create(newPowerSupply, { include: PowerSupplyModel.associations.product })
        const response = fromDbToPowerSupply(createdPowerSupply)
        return response
    }

    async modify(id: number, powerSupply: IPowerSupplyEdit): Promise<PowerSupply> {
        const [editedPowerSupply, powerSupplyArray] = await this.powerSupplyModel.update(powerSupply, { where: { id }, returning: true })
        // update returns an array, first argument is the number of elements updated in the
        // database. Second argument are the array of elements. Im updating by id so there is only 
        // one element in the array.
        if (!editedPowerSupply) {
            throw PowerSupplyError.notFound()
        }
        const modifiedPowerSupply = powerSupplyArray[0]
        return fromDbToPowerSupply(modifiedPowerSupply)
    }

    async delete(id: number): Promise<true> {
        const response = await this.powerSupplyModel.destroy({ where: { id } })
        if (!response) {
            throw PowerSupplyError.notFound()
        }
        return true
    }
}