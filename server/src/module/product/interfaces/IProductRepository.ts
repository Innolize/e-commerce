import { GetProductsDto } from "../dto/getProductsDto";
import { GetProductsReqDto } from "../dto/getProductsReqDto";
import { Product } from "../entity/Product";
import { IProductCreate } from "./IProductCreate";
import { IProductEdit } from "./IProductEdit";

export interface IProductRepository {
    getAllProduct: (querieParams: GetProductsReqDto) => Promise<GetProductsDto>,
    getById(id: number): Promise<Product>,
    createProduct: (product: IProductCreate) => Promise<Product>,
    deleteProduct: (productId: number) => Promise<true>,
    modifyProduct: (id: number, product: IProductEdit) => Promise<Product>
}