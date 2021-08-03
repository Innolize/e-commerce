import { GetCategoriesDto } from "../dto/getCategoriesDto";
import { GetCategoriesReqDto } from "../dto/getCategoriesReqDto";
import { Category } from "../entity/Category";
import { ICategoryEdit } from "./ICategoryEdit";

export interface ICategoryRepository {
    getAllCategories: (queryParams: GetCategoriesReqDto) => Promise<GetCategoriesDto>
    findCategoryById: (id: number) => Promise<Category>
    createCategory: (category: Category) => Promise<Category>
    deleteCategory: (categoryId: number) => Promise<boolean>
    modifyCategory: (id: number, category: ICategoryEdit) => Promise<Category>
}