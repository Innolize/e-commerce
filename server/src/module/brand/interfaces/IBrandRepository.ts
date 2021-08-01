import { GetBrandsDto } from "../dto/getBrandsDto";
import { GetBrandsReqDto } from "../dto/getBrandsReqDto";
import { Brand } from "../entity/Brand";
import { IBrandEdit } from "./IBrandEdit";

export interface IBrandRepository {
    getAllBrands: (queryParams: GetBrandsReqDto) => Promise<GetBrandsDto>
    getById: (id: number) => Promise<Brand>
    createBrand: (brand: Brand) => Promise<Brand>
    deleteBrand: (id: number) => Promise<boolean>
    modifyBrand: (id: number, brand: IBrandEdit) => Promise<Brand>
}