import { GetCategoriesDto } from "../dto/getCategoriesDto";
import { GetCategoriesReqDto } from "../dto/getCategoriesReqDto";
import { Category } from "../entity/Category";
import { IEditableCategory } from "./IEditableCategory";

export interface ICategoryRepository {
    getAllCategories: (queryParams: GetCategoriesReqDto) => Promise<GetCategoriesDto>
    findCategoryById: (id: number) => Promise<Category>
    createCategory: (category: Category) => Promise<Category>
    deleteCategory: (categoryId: number) => Promise<boolean>
    modifyCategory: (product: IEditableCategory) => Promise<Category>
}