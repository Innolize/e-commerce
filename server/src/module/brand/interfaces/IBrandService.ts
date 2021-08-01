import { GetBrandsDto } from "../dto/getBrandsDto";
import { GetBrandsReqDto } from "../dto/getBrandsReqDto";
import { Brand } from "../entity/Brand";
import { IBrandEdit } from "./IBrandEdit";

export interface IBrandService {
    getAllBrands: (queryParams: GetBrandsReqDto) => Promise<GetBrandsDto>,
    deleteBrand: (id: number) => Promise<boolean>,
    modifyBrand: (id: number, product: IBrandEdit) => Promise<Brand>,
    createBrand: (brand: Brand) => Promise<Brand>
    findBrandById: (id: number) => Promise<Brand>
}