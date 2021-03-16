import { inject, injectable } from "inversify";
import { Op } from "sequelize";
import { TYPES } from "../../../config/inversify.types";
import { AbstractRepository } from "../../abstractClasses/abstractRepository";
import { Brand } from "../entity/Brand";
import { IBrand } from "../interfaces/IBrand";
import { IEditableBrand } from "../interfaces/IEditableBrand";
import { fromDbToBrand } from "../mapper/brandMapper";
import { BrandModel } from "../model/brandModel";

@injectable()
export class BrandRepository extends AbstractRepository {
    private brandModel: typeof BrandModel
    constructor(
        @inject(TYPES.Brand.Model) brandModel: typeof BrandModel
    ) {
        super()
        this.brandModel = brandModel
    }

    public async getAllBrands(): Promise<Error | IBrand[]> {
        const response = await this.brandModel.findAll()
        return response.map(fromDbToBrand)

    }

    public async getById(id: number): Promise<Error | IBrand> {
        if (id <= 0) {
            throw Error("Missing brand id")
        }
        const response = await this.brandModel.findByPk(id)
        if (!response) {
            throw Error("Brand not found")
        }

        return fromDbToBrand(response)
    }

    public async createBrand(brand: IBrand): Promise<Error | IBrand> {

        const response = await this.brandModel.create(brand)
        return fromDbToBrand(response)

    }

    public async deleteBrand(id: number): Promise<Error | boolean> {
        if (id <= 0) {
            throw Error('id should be higher than 0')
        }
        const response = await this.brandModel.destroy({
            where:
                { id: id }
        })
        if (!response) {
            throw Error("brand not found")
        }
        return true
    }

    public async modifyBrand(brand: IEditableBrand): Promise<Error | Brand> {

        try {
            const [brandEdited, brandArray] = await this.brandModel.update(brand, { where: { id: brand.id }, returning: true })
            // update returns an array, first argument is the number of elements updated in the
            // database. Second argument are the array of elements. Im updating by id so there is only 
            // one element in the array.
            if(!brandEdited){
                throw new Error("Brand not found")
            }
            const newProduct = fromDbToBrand(brandArray[0])
            return newProduct

        } catch (err) {
            throw new Error(err.message)
        }
    }

    public async getBrandsByName(name: string): Promise<Brand[] | Error> {
        try {
            const response = await this.brandModel.findAll({
                where: {
                    name: {
                        [Op.substring]: name
                    }
                }
            })
            return response.map(fromDbToBrand)
        } catch (e) {
            throw Error(e)
        }
    }
}