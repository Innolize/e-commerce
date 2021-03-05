import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractService } from "../../abstractClasses/abstractService";
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
    async test(){
        this.productRepository.getAllProducts()
    }
}