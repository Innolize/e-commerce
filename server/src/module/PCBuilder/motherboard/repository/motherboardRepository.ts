import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractRepository } from "../../../abstractClasses/abstractRepository";
import { MotherboardModel } from "../model/motherboardModel";
import { fromDbToMotherboard } from '../mapper/motherboardMapper'
import { WhereOptions } from "sequelize";
import { ProductModel } from "../../../product/module";
import { Motherboard } from "../entity/Motherboard";
import { MotherboardError } from "../error/MotherboardError";
import { GetMotherboardReqDto } from "../dto/getMotherboardsReqDto";
import { GetMotherboardDto } from "../dto/getMotherboardsDto";
import { IMotherboardCreate } from "../interface/IMotherboardCreate";
import { IMotherboardEdit } from "../interface/IMotherboardEdit";
import { IMotherboardRepository } from "../interface/IMotherboardRepository";

@injectable()
export class MotherboardRepository extends AbstractRepository implements IMotherboardRepository {
    private motherboardModel: typeof MotherboardModel

    constructor(
        @inject(TYPES.PCBuilder.Motherboard.Model) motherboardModel: typeof MotherboardModel,
    ) {
        super()
        this.motherboardModel = motherboardModel
    }

    async getAll(queryParams: GetMotherboardReqDto): Promise<GetMotherboardDto> {
        const { cpu_brand, offset, limit } = queryParams
        const whereOptions: WhereOptions<Motherboard> = {}
        cpu_brand ? whereOptions.cpu_brand = cpu_brand : ''

        const { count, rows } = await this.motherboardModel.findAndCountAll({ where: whereOptions, offset, limit, include: { association: MotherboardModel.associations.product, include: [{ association: ProductModel.associations.brand }, { association: ProductModel.associations.category }] } });
        const motherboards = rows.map(fromDbToMotherboard)
        const response = new GetMotherboardDto(count, motherboards)
        return response
    }

    async getSingle(id: number): Promise<Motherboard> {

        const response = await this.motherboardModel.findOne({ where: { id }, include: { association: MotherboardModel.associations.product, include: [{ association: ProductModel.associations.brand }, { association: ProductModel.associations.category }] } })
        if (!response) {
            throw MotherboardError.notFound()
        }
        return fromDbToMotherboard(response)

    }

    async create(newMotherBoard: IMotherboardCreate): Promise<Motherboard> {
        const createdMotherboard = await this.motherboardModel.create(newMotherBoard, { include: MotherboardModel.associations.product })
        const response = fromDbToMotherboard(createdMotherboard)
        return response
    }

    async modify(id: number, motherboard: IMotherboardEdit): Promise<Motherboard> {
        const [motherboardEdited, motherboardArray] = await this.motherboardModel.update(motherboard, { where: { id }, returning: true })
        // update returns an array, first argument is the number of elements updated in the
        // database. Second argument are the array of elements. Im updating by id so there is only 
        // one element in the array.
        if (!motherboardEdited) {
            throw MotherboardError.notFound()
        }
        const modifiedProduct = motherboardArray[0]
        return fromDbToMotherboard(modifiedProduct)
    }

    async delete(id: number): Promise<true> {

        const response = await this.motherboardModel.destroy({ where: { id } })
        if (!response) {
            throw MotherboardError.notFound()
        }
        return true

    }
}