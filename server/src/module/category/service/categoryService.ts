import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractService } from "../../abstractClasses/abstractService";
import { Category } from "../entity/Category";
import { ICategory } from "../interfaces/ICategory";
import { IEditableCategory } from "../interfaces/IEditableCategory";
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
        return await this.categoryRepository.getAllCategories()
    }

    async deleteCategory(id: number): Promise<boolean | Error> {
        return await this.categoryRepository.deleteCategory(id)
    }



    async modifyCategory(product: IEditableCategory): Promise<Category | Error> {
        return await this.categoryRepository.modifyCategory(product)
    }

    async createCategory(category: Category): Promise<Category | Error> {
        return await this.categoryRepository.createCategory(category)
    }
    async findCategoryById(id: number): Promise<Error | Category> {
        return await this.categoryRepository.findCategoryById(id)
    }
    async findProductByName(productName: string): Promise<Category[] | Error> {
        return await this.categoryRepository.getCategoryByName(productName)
    }

}