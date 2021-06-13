import { Category } from "../entity/Category"
import { ICategory } from "../interfaces/ICategory"

export const fromDbToCategory = (model: ICategory): Category => {
    const { name, id } = model
    return new Category(name, id)
}