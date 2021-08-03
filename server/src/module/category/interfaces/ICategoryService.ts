import { GetCategoriesDto } from "../dto/getCategoriesDto";
import { GetCategoriesReqDto } from "../dto/getCategoriesReqDto";
import { Category } from "../entity/Category";
import { ICategoryEdit } from "./ICategoryEdit";

export interface ICategoryService {
    getAllCategories: (queryParams: GetCategoriesReqDto) => Promise<GetCategoriesDto>
    deleteCategory: (id: number) => Promise<boolean>
    modifyCategory: (id: number, product: ICategoryEdit) => Promise<Category>
    createCategory: (category: Category) => Promise<Category>
    findCategoryById: (id: number) => Promise<Category>
}