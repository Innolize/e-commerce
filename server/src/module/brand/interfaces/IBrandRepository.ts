import { GetBrandsDto } from "../dto/getBrandsDto";
import { GetBrandsReqDto } from "../dto/getBrandsReqDto";
import { Brand } from "../entity/Brand";
import { IEditableBrand } from "./IEditableBrand";

export interface IBrandRepository {
    getAllBrands: (queryParams: GetBrandsReqDto) => Promise<GetBrandsDto>
    getById: (id: number) => Promise<Brand>
    createBrand: (brand: Brand) => Promise<Brand>
    deleteBrand: (id: number) => Promise<boolean>
    modifyBrand: (brand: IEditableBrand) => Promise<Brand>
}