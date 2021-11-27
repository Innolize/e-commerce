import 'reflect-metadata'
import { GetBrandsReqDto } from "../../../brand/dto/getBrandsReqDto";
import { ICategoryCreate } from '../../interfaces/ICategoryCreate';
import { ICategoryEdit } from '../../interfaces/ICategoryEdit';
import { ICategoryService } from "../../interfaces/ICategoryService";
import { CategoryService } from "../categoryService";

let service: CategoryService
const repository: ICategoryService = {
    createCategory: jest.fn(),
    deleteCategory: jest.fn(),
    findCategoryById: jest.fn(),
    getAllCategories: jest.fn(),
    modifyCategory: jest.fn()
}



beforeAll(() => {
    service = new CategoryService(repository)
});

afterEach(() => {
    jest.clearAllMocks()
});

describe('getAllCategories', () => {
    it('should call repository once with given params', async () => {
        const MOCK_PARAMS: GetBrandsReqDto = { limit: 10, offset: 5, name: 'test' }
        await service.getAllCategories(MOCK_PARAMS)
        expect(repository.getAllCategories).toHaveBeenCalledTimes(1)
        expect(repository.getAllCategories).toHaveBeenCalledWith(MOCK_PARAMS)
    });

    it('should call repository once with default options if no params is given', async () => {
        const DEFAULT_PARAMS: GetBrandsReqDto = {
            limit: 20,
            name: undefined,
            offset: 0
        }
        await service.getAllCategories()
        expect(repository.getAllCategories).toHaveBeenCalledTimes(1)
        expect(repository.getAllCategories).toHaveBeenCalledWith(DEFAULT_PARAMS)
    });
});

describe('deleteCategory', () => {
    it('should call repository.deleteCategory once', async () => {
        const CATEGORY_ID = 5
        await service.deleteCategory(5)
        expect(repository.deleteCategory).toHaveBeenCalledWith(CATEGORY_ID)
    });
});

describe('modifyCategory', () => {
    it('should call repository.modifyCategory once', async () => {
        const CATEGORY_ID = 5
        const newCategoryProps: ICategoryEdit = {
            name: 'new-category-name'
        }
        await service.modifyCategory(CATEGORY_ID, newCategoryProps)
        expect(repository.modifyCategory).toHaveBeenCalledWith(CATEGORY_ID, newCategoryProps)
    });
});

describe('createCategory', () => {
    it('should call repository.createCategory once', async () => {
        const newCategory: ICategoryCreate = {
            name: 'new-category'
        }
        await service.createCategory(newCategory)
        expect(repository.createCategory).toHaveBeenCalledWith(newCategory)
        expect(repository.createCategory).toHaveBeenCalledTimes(1)
    });
});

describe('findCategoryById', () => {
    it('should call repository.findCategoryById', async () => {
        const ID = 5
        await service.findCategoryById(ID)
        expect(repository.findCategoryById).toHaveBeenCalledWith(ID)
        expect(repository.findCategoryById).toHaveBeenCalledTimes(1)
    });
});