import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractService } from "../../abstractClasses/abstractService";
import { Category } from "../entity/Category";
import { ICategoryEdit } from "../interfaces/ICategoryEdit";
import { GetCategoriesReqDto } from "../dto/getCategoriesReqDto";
import { GetCategoriesDto } from "../dto/getCategoriesDto";
import { ICategoryService } from "../interfaces/ICategoryService";
import { ICategoryRepository } from "../interfaces/ICategoryRepository";


@injectable()
export class CategoryService extends AbstractService implements ICategoryService {
    private DEFAULT_LIMIT = 20
    private DEFAULT_OFFSET = 0

    constructor(
        @inject(TYPES.Category.Repository) private categoryRepository: ICategoryRepository
    ) {
        super()
        this.categoryRepository = categoryRepository
    }

    async getAllCategories(queryParams?: GetCategoriesReqDto): Promise<GetCategoriesDto> {
        const limit = queryParams?.limit || this.DEFAULT_LIMIT
        const offset = queryParams?.offset || this.DEFAULT_OFFSET
        const name = queryParams?.name
        return await this.categoryRepository.getAllCategories({ limit, name, offset })
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