import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractService } from "../../abstractClasses/abstractService";
import { Product } from "../entity/Product";
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
    async deleteProduct(id: number) {
        return await this.productRepository.deleteProduct(id)
    }

    async getAllProducts() {
        await this.productRepository.getAllProduct()
    }
    async createProduct(product: Product) {
        await this.productRepository.createProduct(product)
    }
    async findProductById(id: number) {
        await this.productRepository.getById(id)
    }
    async findProductByName(productName: string) {
        await this.productRepository.getProductsByName(productName)
    }

}