import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractService } from "../../abstractClasses/abstractService";
import { FullProduct } from "../entity/FullProduct";
import { Product } from "../entity/Product";
import { IProductCreate } from "../interfaces/IProductCreate";
import { IProductEdit } from "../interfaces/IProductEdit";
import { ProductRepository } from "../repository/productRepository";

@injectable()
export class ProductService extends AbstractService {
    private productRepository: ProductRepository
    constructor(
        @inject(TYPES.Product.Repository) repository: ProductRepository
    ) {
        super()
        this.productRepository = repository
    }
    async deleteProduct(id: number): Promise<boolean | Error> {
        return await this.productRepository.deleteProduct(id)
    }

    async getAllProducts(): Promise<Error | FullProduct[]> {
        return await this.productRepository.getAllProduct()
    }

    async modifyProduct(product: IProductEdit): Promise<Product | Error> {
        return await this.productRepository.modifyProduct(product)
    }

    async createProduct(product: IProductCreate): Promise<Product | Error> {
        return await this.productRepository.createProduct(product)
    }
    async findProductById(id: number): Promise<Error | FullProduct> {
        return await this.productRepository.getById(id)
    }
    async findProductByName(productName: string): Promise<FullProduct[] | Error> {
        return await this.productRepository.getProductsByName(productName)
    }

}