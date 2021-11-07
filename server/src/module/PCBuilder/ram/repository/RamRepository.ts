import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractRepository } from "../../../abstractClasses/abstractRepository";
import { Op, WhereOptions } from "sequelize";
import { ProductModel } from "../../../product/module";
import { RamModel } from "../model/ramModel";
import { fromDbToRam } from "../mapper/ramMapper";
import { Ram } from "../entities/Ram";
import { RamError } from "../error/RamError";
import { GetRamReqDto } from "../dto/getRamReqDto";
import { GetRamDto } from "../dto/getRamDto";
import { IRamRepository } from "../interface/IRamRepository";
import { IRamCreate } from "../interface/IRamCreate";
import { IRamEdit } from "../interface/IRamEdit";

@injectable()
export class RamRepository extends AbstractRepository implements IRamRepository {
    private ramModel: typeof RamModel

    constructor(
        @inject(TYPES.PCBuilder.Ram.Model) ramModel: typeof RamModel,
    ) {
        super()
        this.ramModel = ramModel
    }

    async getAll(queryParams: GetRamReqDto): Promise<GetRamDto> {
        const { ram_version, min_frec, max_frec, offset, limit } = queryParams
        const whereOptions: WhereOptions<Ram> = {}
        min_frec ? whereOptions.min_frec = { [Op.gte]: min_frec } : ''
        max_frec ? whereOptions.max_frec = { [Op.lte]: max_frec } : ''
        ram_version ? whereOptions.ram_version = ram_version : ''
        const { rows, count } = await this.ramModel.findAndCountAll({ where: whereOptions, limit, offset, include: { association: RamModel.associations.product, include: [{ association: ProductModel.associations.brand }, { association: ProductModel.associations.category }] } });
        const rams = rows.map(fromDbToRam)
        const response = new GetRamDto(count, rams)
        return response
    }

    async getSingle(id: number): Promise<Ram> {
        const response = await this.ramModel.findByPk(id, { include: { association: RamModel.associations.product, include: [{ association: ProductModel.associations.brand }, { association: ProductModel.associations.category }] } })
        if (!response) {
            throw RamError.notFound()
        }
        const ram = fromDbToRam(response)
        return ram
    }

    async create(newRam: IRamCreate): Promise<Ram> {
        const createdRam = await this.ramModel.create(newRam, { include: RamModel.associations.product })
        const response = fromDbToRam(createdRam)
        return response
    }

    async modify(id: number, ram: IRamEdit): Promise<Ram> {
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

    async delete(id: number): Promise<true> {
        const response = await this.ramModel.destroy({ where: { id } })
        if (!response) {
            throw RamError.notFound()
        }
        return true
    }
}