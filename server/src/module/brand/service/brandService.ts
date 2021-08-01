import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractService } from "../../abstractClasses/abstractService";
import { GetBrandsDto } from "../dto/getBrandsDto";
import { GetBrandsReqDto } from "../dto/getBrandsReqDto";
import { Brand } from "../entity/Brand";
import { IBrandRepository } from "../interfaces/IBrandRepository";
import { IBrandService } from "../interfaces/IBrandService";
import { IBrandEdit } from "../interfaces/IBrandEdit";

@injectable()
export class BrandService extends AbstractService implements IBrandService {
    private brandRepository: IBrandRepository
    private DEFAULT_OFFSET = 0
    private DEFAULT_LIMIT = 0
    constructor(
        @inject(TYPES.Brand.Repository) brandRepository: IBrandRepository
    ) {
        super()
        this.brandRepository = brandRepository
    }

    async getAllBrands(queryParams?: GetBrandsReqDto): Promise<GetBrandsDto> {
        const offset = queryParams?.offset || this.DEFAULT_OFFSET
        const limit = queryParams?.limit || this.DEFAULT_LIMIT
        const name = queryParams?.name
        return await this.brandRepository.getAllBrands({ limit, offset, name })
    }

    async deleteBrand(id: number): Promise<boolean> {
        return await this.brandRepository.deleteBrand(id)
    }

    async modifyBrand(brandId: number, brand: IBrandEdit): Promise<Brand> {
        return await this.brandRepository.modifyBrand(brandId, brand)
    }

    async createBrand(brand: Brand): Promise<Brand> {
        return await this.brandRepository.createBrand(brand)
    }
    async findBrandById(id: number): Promise<Brand> {
        return await this.brandRepository.getById(id)
    }
}