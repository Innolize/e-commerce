import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractService } from "../../abstractClasses/abstractService";
import { GetBrandsDto } from "../dto/getBrandsDto";
import { GetBrandsReqDto } from "../dto/getBrandsReqDto";
import { Brand } from "../entity/Brand";
import { IEditableBrand } from "../interfaces/IEditableBrand";
import { BrandRepository } from "../repository/brandRepository";

@injectable()
export class BrandService extends AbstractService {
    private brandRepository: BrandRepository
    constructor(
        @inject(TYPES.Brand.Repository) brandRepository: BrandRepository
    ) {
        super()
        this.brandRepository = brandRepository
    }

    async getAllCategories(queryParams: GetBrandsReqDto): Promise<Error | GetBrandsDto> {
        return await this.brandRepository.getAllBrands(queryParams)
    }

    async deleteBrand(id: number): Promise<boolean | Error> {
        return await this.brandRepository.deleteBrand(id)
    }

    async modifyBrand(product: IEditableBrand): Promise<Brand | Error> {
        return await this.brandRepository.modifyBrand(product)
    }

    async createBrand(brand: Brand): Promise<Brand | Error> {
        return await this.brandRepository.createBrand(brand)
    }
    async findBrandById(id: number): Promise<Brand> {
        return await this.brandRepository.getById(id)
    }
}