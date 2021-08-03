import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractService } from "../../abstractClasses/abstractService";
import { Category } from "../entity/Category";
import { ICategoryEdit } from "../interfaces/ICategoryEdit";
import { CategoryRepository } from "../repository/categoryRepository";
import { GetCategoriesReqDto } from "../dto/getCategoriesReqDto";
import { GetCategoriesDto } from "../dto/getCategoriesDto";


@injectable()
export class CategoryService extends AbstractService {
    private categoryRepository: CategoryRepository
    constructor(
        @inject(TYPES.Category.Repository) categoryRepository: CategoryRepository
    ) {
        super()
        this.categoryRepository = categoryRepository
    }

    async getAllCategories(queryParams: GetCategoriesReqDto): Promise<GetCategoriesDto> {
        return await this.categoryRepository.getAllCategories(queryParams)
    }

    async deleteCategory(id: number): Promise<boolean> {
        return await this.categoryRepository.deleteCategory(id)
    }

    async modifyCategory(id: number, product: ICategoryEdit): Promise<Category> {
        return await this.categoryRepository.modifyCategory(id, product)
    }

    async createCategory(category: Category): Promise<Category> {
        return await this.categoryRepository.createCategory(category)
    }
    async findCategoryById(id: number): Promise<Category> {
        return await this.categoryRepository.findCategoryById(id)
    }
}