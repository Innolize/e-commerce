import { inject, injectable } from "inversify";
import { Op, WhereOptions } from "sequelize";
import { TYPES } from "../../../config/inversify.types";
import { AbstractRepository } from "../../abstractClasses/abstractRepository";
import { Brand } from "../../brand/entity/Brand";
import { Category } from "../entity/Category";
import { CategoryError } from "../error/CategoryError";
import { IEditableCategory } from "../interfaces/IEditableCategory";
import { IGetAllCategoriesQueries } from "../interfaces/IGetAllCategoriesQueries";
import { fromDbToCategory } from "../mapper/categoryMapper";
import { CategoryModel } from "../model/categoryModel";

@injectable()
export class CategoryRepository extends AbstractRepository {
    private categoryModel: typeof CategoryModel
    constructor(
        @inject(TYPES.Category.Model) categoryModel: typeof CategoryModel
    ) {
        super()
        this.categoryModel = categoryModel
    }

    public async getAllCategories(queryParams?: IGetAllCategoriesQueries): Promise<Error | Category[]> {
        const findQuery: WhereOptions<Brand> = {}
        if (queryParams) {
            queryParams.name ? findQuery.name = { [Op.substring]: queryParams.name } : ''
        }
        const response = await this.categoryModel.findAll({ where: findQuery })
        return response.map(fromDbToCategory)
    }

    public async findCategoryById(id: number): Promise<Error | Category> {
        const response = await this.categoryModel.findByPk(id)
        if (!response) {
            throw CategoryError.notFound()
        }

        return fromDbToCategory(response)
    }

    public async createCategory(category: Category): Promise<Error | Category> {
        try {
            const response = await this.categoryModel.create(category)
            return fromDbToCategory(response)
        } catch (e) {
            throw Error(e)
        }
    }

    public async deleteCategory(categoryId: number): Promise<Error | boolean> {
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

    public async modifyCategory(product: IEditableCategory): Promise<Error | Category> {
        const [categoriesEdited, categoryArray] = await this.categoryModel.update(product, { where: { id: product.id }, returning: true })
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