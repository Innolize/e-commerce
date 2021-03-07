import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractService } from "../../abstractClasses/abstractService";
import { ICategory } from "../interfaces/ICategory";
import { CategoryRepository } from "../repository/categoryRepository";


@injectable()
export class CategoryService extends AbstractService {
    private categoryRepository: CategoryRepository
    constructor(
        @inject(TYPES.Category.Repository) categoryRepository: CategoryRepository
    ) {
        super()
        this.categoryRepository = categoryRepository
    }

    async getAllCategories(): Promise<Error | ICategory[]> {
        console.log("entre al service")
        return await this.categoryRepository.getAllCategories()
    }

    // async deleteProduct(id: number): Promise<boolean | Error> {
    //     return await this.categoryRepository.deleteProduct(id)
    // }



    // async modifyProduct(product: IEditableProduct): Promise<Product | Error> {
    //     return await this.categoryRepository.modifyProduct(product)
    // }

    // async createProduct(product: Product): Promise<IProduct | Error> {
    //     return await this.categoryRepository.createProduct(product)
    // }
    // async findProductById(id: number): Promise<Error | IProduct> {
    //     return await this.categoryRepository.getById(id)
    // }
    // async findProductByName(productName: string): Promise<Product[] | Error> {
    //     return await this.categoryRepository.getProductsByName(productName)
    // }

}