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
        console.log("llegue al repository")
        try {
            const response = await this.categoryModel.findAll()
            console.log(response)
            if (!response) {
                throw new Error()

            }
            return response.map(fromDbToCategory)
        } catch (err) {
            console.log(err)
            throw Error()
        }


    }

    public async findCategoryById(id: number): Promise<Error | ICategory> {
        if (!id) {
            throw Error("missing id")
        }
        const response = await this.categoryModel.findByPk(id)
        if (!response) {
            throw Error("product not found")
        }

        return fromDbToCategory(response)
    }

    public async createCategory(category: ICategory): Promise<Error | ICategory> {
        if (!category) {
            throw Error('missing product')
        }
        try {
            const response = await this.categoryModel.create(category)
            return fromDbToCategory(response)
        } catch (e) {
            throw Error(e)
        }
    }

    public async deleteCategory(categoryId: number): Promise<Error | boolean> {
        if (!categoryId && categoryId !== 0) {
            throw Error('missing product')
        }
        try {
            const response = await this.categoryModel.destroy({
                where:
                    { id: categoryId }
            })
            console.log(typeof (response))
            if (!response) {
                console.log(12312312312)
                throw Error("not found")
            }
        } catch (err) {
            throw Error(err)
        }
        return true
    }

    public async modifyCategory(product: IEditableCategory): Promise<Error | Category> {
        if (!product.id) {
            throw Error("Product should have an id.")
        }
        try {
            const editableProduct = await this.categoryModel.update(product, { where: { id: product.id }, returning: true })
            // update returns an array, first argument is the number of elements updated in the
            // database. Second argument are the array of elements. Im updating by id so there is only 
            // one element in the array.
            const newProduct = fromDbToCategory(editableProduct[1][0])
            return newProduct

        } catch (err) {
            throw Error(err)
        }
    }

    public async getCategoryByName(name: string): Promise<Category[] | Error> {
        if (!name) {
            throw Error("missing product name")
        }
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