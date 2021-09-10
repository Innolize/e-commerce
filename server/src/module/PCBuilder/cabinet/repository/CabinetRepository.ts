import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractRepository } from "../../../abstractClasses/abstractRepository";
import { Sequelize, WhereOptions } from "sequelize";
import { ProductModel } from "../../../product/module";
import { Product } from "../../../product/entity/Product";
import { CabinetModel } from "../model/CabinetModel";
import { fromDbToCabinet } from "../mapper/cabinetMapper";
import { Cabinet } from "../entities/Cabinet";
import { ICabinetEdit } from "../interface/ICabinetEdit";
import { CabinetError } from "../error/CabinetError";
import { GetCabinetsDto } from "../dto/getCabinetsDto";
import { GetCabinetsReqDto } from "../dto/getCabinetsReqDto";
import { ICabinetProductless } from "../interface/ICabinetCreate";
import { ICabinetRepository } from "../interface/ICabinetRepository";

@injectable()
export class CabinetRepository extends AbstractRepository implements ICabinetRepository {
    constructor(
        @inject(TYPES.PCBuilder.Cabinet.Model) private cabinetModel: typeof CabinetModel,
        @inject(TYPES.Common.Database) private ORM: Sequelize,
        @inject(TYPES.Product.Model) private productModel: typeof ProductModel
    ) {
        super()
        this.cabinetModel = cabinetModel
        this.productModel = productModel
        this.ORM = ORM
    }

    async getCabinets(queryParams: GetCabinetsReqDto): Promise<GetCabinetsDto> {
        const { size, offset, limit } = queryParams
        const whereOptions: WhereOptions<Cabinet> = {}
        size ? whereOptions.size = size : ''
        const { count, rows } = await this.cabinetModel.findAndCountAll({
            where: whereOptions,
            offset,
            limit,
            include: [
                {
                    association: CabinetModel.associations.product,
                    include: [
                        { association: ProductModel.associations.brand },
                        { association: ProductModel.associations.category }
                    ]
                }]
        });
        const cabinets = rows.map(fromDbToCabinet)
        const response = new GetCabinetsDto(count, cabinets)
        return response
    }

    async getSingleCabinet(id: number): Promise<Cabinet> {
        const response = await this.cabinetModel.findByPk(id, {
            include: {
                association: CabinetModel.associations.product,
                include: [
                    { association: ProductModel.associations.brand },
                    { association: ProductModel.associations.category }
                ]
            }
        })
        if (!response) {
            throw CabinetError.notFound()
        }
        const cabinet = fromDbToCabinet(response)
        return cabinet
    }

    async createCabinet(product: Product, cabinet: ICabinetProductless): Promise<Cabinet> {
        const transaction = await this.ORM.transaction()
        const newProduct = await this.productModel.create(product, { transaction, isNewRecord: true });
        const id_product = newProduct.getDataValue("id") as number
        const newCabinet = fromDbToCabinet({ ...cabinet, id_product })
        const createdCabinet = await this.cabinetModel.create(newCabinet, { transaction, isNewRecord: true })
        transaction.commit()
        const response = fromDbToCabinet(createdCabinet)
        return response
    }

    async modifyCabinet(id: number, cabinet: ICabinetEdit): Promise<Cabinet> {
        const [editedCabinet, ramArray] = await this.cabinetModel.update(cabinet, { where: { id }, returning: true })
        // update returns an array, first argument is the number of elements updated in the
        // database. Second argument are the array of elements. Im updating by id so there is only 
        // one element in the array.
        if (!editedCabinet) {
            throw CabinetError.notFound()
        }
        const modifiedRam = ramArray[0]
        return fromDbToCabinet(modifiedRam)
    }

    async deleteCabinet(id: number): Promise<true> {

        const response = await this.cabinetModel.destroy({ where: { id } })
        if (!response) {
            throw CabinetError.notFound()
        }
        return true

    }
}