import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractRepository } from "../../../abstractClasses/abstractRepository";
import { Op, Sequelize } from "sequelize";
import { ProductModel } from "../../../product/module";
import { Product } from "../../../product/entity/Product";
import { FullRam } from "../entities/FullRam";
import { RamModel } from "../model/ramModel";
import { fromDbToFullRam } from "../mapper/ramMapper";
import { IRamQuery } from "../interface/IRamQuery";

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

    async getRams(query?: IRamQuery): Promise<FullRam[]> {
        const queryParams: {
            min_frec?: unknown,
            max_frec?: unknown,
            ram_version?: unknown,
        } = {}
        if (query) {
            if (query.min_frec) {
                queryParams.min_frec = {
                    [Op.gte]: query.min_frec
                }
            }
            if (query.max_frec) {
                queryParams.max_frec = {
                    [Op.lte]: query.max_frec
                }
            }
            if (query.ram_version) {
                queryParams.ram_version = query.ram_version
            }
        }
        console.log(queryParams)
        const response = await this.ramModel.findAll({ where: queryParams, include: "product" });
        return response.map(fromDbToFullRam)
    }
}