import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractService } from "../../abstractClasses/abstractService";
import { Category } from "../entity/Category";
import { IEditableCategory } from "../interfaces/IEditableCategory";
import { IGetAllCategoriesQueries } from "../interfaces/IGetAllCategoriesQueries";
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

    async getAllCategories(queryParams? : IGetAllCategoriesQueries): Promise<Error | Category[]> {
        return await this.categoryRepository.getAllCategories(queryParams)
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
}