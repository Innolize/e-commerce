import { inject, injectable } from "inversify";
import { WhereOptions } from "sequelize";
import { Op } from "sequelize";
import { TYPES } from "../../../config/inversify.types";
import { AbstractRepository } from "../../abstractClasses/abstractRepository";
import { GetBrandsDto } from "../dto/getBrandsDto";
import { GetBrandsReqDto } from "../dto/getBrandsReqDto";
import { Brand } from "../entity/Brand";
import { BrandError } from "../error/BrandError";
import { IBrandRepository } from "../interfaces/IBrandRepository";
import { IBrandEdit } from "../interfaces/IBrandEdit";
import { fromDbToBrand } from "../mapper/brandMapper";
import { BrandModel } from "../model/brandModel";

@injectable()
export class BrandRepository extends AbstractRepository implements IBrandRepository {
    private brandModel: typeof BrandModel
    constructor(
        @inject(TYPES.Brand.Model) brandModel: typeof BrandModel
    ) {
        super()
        this.brandModel = brandModel
    }

    public async getAllBrands(queryParams: GetBrandsReqDto): Promise<GetBrandsDto> {
        const { name, offset, limit } = queryParams
        const whereOptions: WhereOptions<Brand> = {}
        name ? whereOptions.name = { [Op.substring]: name } : ''
        const { rows, count } = await this.brandModel.findAndCountAll({ where: whereOptions, limit, offset })
        const brands = rows.map(fromDbToBrand)
        const response = new GetBrandsDto(count, brands)
        return response
    }

    public async getById(id: number): Promise<Brand> {
        if (id <= 0) {
            throw BrandError.missingId()
        }
        const response = await this.brandModel.findByPk(id)
        if (!response) {
            throw BrandError.notFound()
        }
        return fromDbToBrand(response)
    }

    public async createBrand(brand: Brand): Promise<Brand> {
        const response = await this.brandModel.create(brand)
        return fromDbToBrand(response)
    }

    public async deleteBrand(id: number): Promise<boolean> {
        if (id <= 0) {
            throw BrandError.invalidId()
        }
        const response = await this.brandModel.destroy({ where: { id: id } })
        if (!response) {
            throw BrandError.notFound()
        }
        return true
    }

    public async modifyBrand(id: number, brand: IBrandEdit): Promise<Brand> {
        const [brandEdited, brandArray] = await this.brandModel.update(brand, { where: { id }, returning: true })
        // update returns an array, first argument is the number of elements updated in the
        // database. Second argument are the array of elements. Im updating by id so there is only 
        // one element in the array.
        if (!brandEdited) {
            throw BrandError.notFound()
        }
        const newProduct = fromDbToBrand(brandArray[0])
        return newProduct
    }
}