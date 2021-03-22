import { inject, injectable } from "inversify";
import { Op } from "sequelize";
import { TYPES } from "../../../config/inversify.types";
import { AbstractRepository } from "../../abstractClasses/abstractRepository";
import { Category } from "../entity/Category";
import { ICategory } from "../interfaces/ICategory";
import { IEditableCategory } from "../interfaces/IEditableCategory";
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

    public async getAllCategories(): Promise<Error | ICategory[]> {
        const response = await this.categoryModel.findAll()
        return response.map(fromDbToCategory)
    }

    public async findCategoryById(id: number): Promise<Error | ICategory> {
        const response = await this.categoryModel.findByPk(id)
        if (!response) {
            throw Error("product not found")
        }

        return fromDbToCategory(response)
    }

    public async createCategory(category: ICategory): Promise<Error | ICategory> {

        try {
            const response = await this.categoryModel.create(category)
            return fromDbToCategory(response)
        } catch (e) {
            throw Error(e)
        }
    }

    public async deleteCategory(categoryId: number): Promise<Error | boolean> {
        if (categoryId <= 0) {
            throw Error('Category Id should be higher than 0')
        }
        try {
            const response = await this.categoryModel.destroy({
                where:
                    { id: categoryId }
            })
            if (!response) {
                throw Error("not found")
            }
        } catch (err) {
            throw Error(err)
        }
        return true
    }

    public async modifyCategory(product: IEditableCategory): Promise<Error | Category> {
        const [categoriesEdited, categoryArray] = await this.categoryModel.update(product, { where: { id: product.id }, returning: true })
        // update returns an array, first argument is the number of elements updated in the
        // database. Second argument are the array of elements. Im updating by id so there is only 
        // one element in the array.
        if (!categoriesEdited) {
            throw new Error("Category not found")
        }
        const categoryEdited = categoryArray[0]
        const newProduct = fromDbToCategory(categoryEdited)
        return newProduct

    }

    public async getCategoryByName(name: string): Promise<Category[] | Error> {

        try {
            const response = await this.categoryModel.findAll({
                where: {
                    name: {
                        [Op.substring]: name
                    }
                }
            })
            return response.map(fromDbToCategory)
        } catch (e) {
            throw Error(e)
        }
    }
}