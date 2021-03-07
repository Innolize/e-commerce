import { inject, injectable } from "inversify";
import { Op } from "sequelize";
import { TYPES } from "../../../config/inversify.types";
import { AbstractRepository } from "../../abstractClasses/abstractRepository";
import { Brand } from "../entity/Category";
import { IBrand } from "../interfaces/IBrand";
import { IEditableBrand } from "../interfaces/IEditableBrand";
import { fromDbToBrand } from "../mapper/brandMapper";
import { BrandModel } from "../model/brandModel";

@injectable()
export class BrandRepository extends AbstractRepository {
    private brandModel: typeof BrandModel
    constructor(
        @inject(TYPES.Category.Model) brandModel: typeof BrandModel
    ) {
        super()
        this.brandModel = brandModel
    }

    public async getAllBrands(): Promise<Error | IBrand[]> {
        console.log("llegue al repository")
        try {
            const response = await this.brandModel.findAll()
            console.log(response)
            if (!response) {
                throw new Error()

            }
            return response.map(fromDbToBrand)
        } catch (err) {
            console.log(err)
            throw Error()
        }


    }

    public async getById(id: number): Promise<Error | IBrand> {
        if (!id) {
            throw Error("missing id")
        }
        const response = await this.brandModel.findByPk(id)
        if (!response) {
            throw Error("product not found")
        }

        return fromDbToBrand(response)
    }

    public async createBrand(brand: IBrand): Promise<Error | IBrand> {
        if (!brand) {
            throw Error('missing product')
        }
        try {
            const response = await this.brandModel.create(brand)
            return fromDbToBrand(response)
        } catch (e) {
            throw Error(e)
        }
    }

    public async deleteBrand(id: number): Promise<Error | boolean> {
        if (!id && id !== 0) {
            throw Error('missing product')
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
        if (!brand.id) {
            throw Error("Product should have an id.")
        }
        try {
            const editableProduct = await this.brandModel.update(brand, { where: { id: brand.id }, returning: true })
            // update returns an array, first argument is the number of elements updated in the
            // database. Second argument are the array of elements. Im updating by id so there is only 
            // one element in the array.
            const newProduct = fromDbToBrand(editableProduct[1][0])
            return newProduct

        } catch (err) {
            throw Error(err)
        }
    }

    public async getBrandsByName(name: string): Promise<Brand[] | Error> {
        if (!name) {
            throw Error("missing product name")
        }
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