import { Category } from "../entity/Category"
import { CategoryModel } from "../model/categoryModel"

export const fromDbToCategory = (model: CategoryModel): Category => {
    return new Category(model.toJSON() as Category)
}