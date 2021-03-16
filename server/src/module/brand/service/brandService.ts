import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractService } from "../../abstractClasses/abstractService";
import { Brand } from "../entity/Brand";
import { IBrand } from "../interfaces/IBrand";
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

    async getAllCategories(): Promise<Error | IBrand[]> {
        console.log("entre al service")
        return await this.brandRepository.getAllBrands()
    }

    async deleteBrand(id: number): Promise<boolean | Error> {
        return await this.brandRepository.deleteBrand(id)
    }

    async modifyBrand(product: IEditableBrand): Promise<Brand | Error> {
        return await this.brandRepository.modifyBrand(product)
    }

    async createBrand(brand: IBrand): Promise<Brand | Error> {
        return await this.brandRepository.createBrand(brand)
    }
    async findBrandById(id: number): Promise<Error | Brand> {
        return await this.brandRepository.getById(id)
    }
    async findBrandByName(productName: string): Promise<Brand[] | Error> {
        return await this.brandRepository.getBrandsByName(productName)
    }

}