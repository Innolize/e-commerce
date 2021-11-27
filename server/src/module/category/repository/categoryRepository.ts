import { inject, injectable } from "inversify";
import { Op, WhereOptions } from "sequelize";
import { TYPES } from "../../../config/inversify.types";
import { AbstractRepository } from "../../abstractClasses/abstractRepository";
import { Brand } from "../../brand/entity/Brand";
import { Category } from "../entity/Category";
import { CategoryError } from "../error/CategoryError";
import { ICategoryEdit } from "../interfaces/ICategoryEdit";
import { fromDbToCategory } from "../mapper/categoryMapper";
import { CategoryModel } from "../model/categoryModel";
import { GetCategoriesDto } from "../dto/getCategoriesDto";
import { GetCategoriesReqDto } from "../dto/getCategoriesReqDto";
import { ICategoryRepository } from "../interfaces/ICategoryRepository";

@injectable()
export class CategoryRepository extends AbstractRepository implements ICategoryRepository {
    constructor(
        @inject(TYPES.Category.Model) private categoryModel: typeof CategoryModel
    ) {
        super()
        this.categoryModel = categoryModel
    }

    public async getAllCategories(queryParams: GetCategoriesReqDto): Promise<GetCategoriesDto> {
        const { name, limit, offset } = queryParams
        const whereOptions: WhereOptions<Brand> = {}
        name ? whereOptions.name = { [Op.substring]: name } : ''
        const { count, rows } = await this.categoryModel.findAndCountAll({ where: whereOptions, limit, offset })
        const categories = rows.map(fromDbToCategory)
        const response = new GetCategoriesDto(count, categories)
        return response
    }

    public async findCategoryById(id: number): Promise<Category> {
        const response = await this.categoryModel.findByPk(id)
        if (!response) {
            throw CategoryError.notFound()
        }

        return fromDbToCategory(response)
    }

    public async createCategory(category: Category): Promise<Category> {
        const response = await this.categoryModel.create(category)
        return fromDbToCategory(response)
    }

    public async deleteCategory(categoryId: number): Promise<boolean> {
        if (categoryId <= 0) {
            throw CategoryError.invalidId()
        }
        const response = await this.categoryModel.destroy({
            where:
                { id: categoryId }
        })
        if (!response) {
            throw CategoryError.notFound()
        }
        return true
    }

    public async modifyCategory(id: number, category: ICategoryEdit): Promise<Category> {
        const [categoriesEdited, categoryArray] = await this.categoryModel.update(category, { where: { id }, returning: true })
        // update returns an array, first argument is the number of elements updated in the
        // database. Second argument are the array of elements. Im updating by id so there is only 
        // one element in the array.
        if (!categoriesEdited) {
            throw CategoryError.notFound()
        }
        const categoryEdited = categoryArray[0]
        const newProduct = fromDbToCategory(categoryEdited)
        return newProduct

    }
}