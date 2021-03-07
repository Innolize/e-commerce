import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractService } from "../../abstractClasses/abstractService";
import { Product } from "../entity/Product";
import { IEditableProduct } from "../interfaces/IEditableProduct";
import { IProduct } from "../interfaces/IProduct";
import { ProductRepository } from "../repository/productRepository";

@injectable()
export class ProductService extends AbstractService {
    private productRepository: ProductRepository
    constructor(
        @inject(TYPES.ProductRepository) repository: ProductRepository
    ) {
        super()
        this.productRepository = repository
    }
    async deleteProduct(id: number): Promise<boolean | Error> {
        return await this.productRepository.deleteProduct(id)
    }

    async getAllProducts(): Promise<Error | IProduct[]> {
        return await this.productRepository.getAllProduct()
    }

    async modifyProduct(product: IEditableProduct): Promise<Product | Error> {
        return await this.productRepository.modifyProduct(product)
    }

    async createProduct(product: Product): Promise<IProduct | Error> {
        return await this.productRepository.createProduct(product)
    }
    async findProductById(id: number): Promise<Error | IProduct> {
        return await this.productRepository.getById(id)
    }
    async findProductByName(productName: string): Promise<Product[] | Error> {
        return await this.productRepository.getProductsByName(productName)
    }

}