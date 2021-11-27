import { Brand } from "../../brand/entity/Brand";
import { Category } from "../../category/entity/Category";
import { GetProductsDto } from "../dto/getProductsDto";
import { GetProductsReqDto } from "../dto/getProductsReqDto";
import { Product } from "../entity/Product";
import { IProductCreate } from "./IProductCreate";
import { IProductEdit } from "./IProductEdit";

export interface IProductService{
    deleteProduct(id: number): Promise<boolean>
    getAllProducts(queryParams: GetProductsReqDto): Promise<GetProductsDto>
    modifyProduct(id: number, product: IProductEdit): Promise<Product>
    createProduct(product: IProductCreate): Promise<Product>
    findProductById(id: number): Promise<Product>
    verifyCategoryAndBrandExistence(categoryId: number, brandId: number): Promise<{ category: Category, brand: Brand }>
}