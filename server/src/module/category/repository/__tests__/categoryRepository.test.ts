import 'reflect-metadata'
import dotenv from 'dotenv'
dotenv.config()
import { Sequelize } from 'sequelize';
import { CategoryModel } from '../../model/categoryModel';
import { CategoryRepository } from '../categoryRepository';
import { ICategoryCreate } from '../../interfaces/ICategoryCreate';
import { CategoryError } from '../../error/CategoryError';
import { Category } from '../../entity/Category';
import { ICategoryEdit } from '../../interfaces/ICategoryEdit';

let sequelizeInstance: Sequelize
let category: typeof CategoryModel
let repository: CategoryRepository

beforeAll(async () => {
    sequelizeInstance = new Sequelize(<string>process.env.TEST_DATABASE_URL, {
        logging: false,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        dialect: 'postgres'
    })
    await sequelizeInstance.drop({ cascade: true })
    category = CategoryModel.setup(sequelizeInstance)
    repository = new CategoryRepository(category)
});

beforeEach(async (done) => {
    await sequelizeInstance.sync({ force: true });
    done();
});

afterAll(async () => {
    await sequelizeInstance.close();
});


const CATEGORY_1: ICategoryCreate = {
    name: 'CATEGORY_1'
}

const CATEGORY_2: ICategoryCreate = {
    name: 'CATEGORY_2'
}

const CATEGORY_3: ICategoryCreate = {
    name: 'CATEGORY_3'
}

describe('getAllCategories', () => {
    it('should retrieve categories', async () => {
        await category.create(CATEGORY_1)
        await category.create(CATEGORY_2)
        await category.create(CATEGORY_3)
        const test = await repository.getAllCategories({ offset: 0, limit: 5 })
        expect(test.results).toHaveLength(3)
    });
});

describe('findCategoryById', () => {
    it('should retrieve category with given id', async () => {
        const CATEGORY_NAME = 'test-category'
        await category.create({ name: CATEGORY_NAME })
        const foundCategory = await repository.findCategoryById(1)
        expect(foundCategory.id).toBe(1)
    });

    it('should throw if category not found', async () => {
        const INEXISTENT_ID = 520
        expect.assertions(1)
        try {
            await repository.findCategoryById(INEXISTENT_ID)
        } catch (err) {
            expect(err).toBeInstanceOf(CategoryError)
        }
    });
});

describe('createCategory', () => {
    it('should create category', async () => {
        const newCategory = await repository.createCategory(CATEGORY_1)
        expect(newCategory).toBeInstanceOf(Category)
        expect(newCategory.id).toBe(1)
    });
});

describe('deleteCategory', () => {
    it('should delete category successfully', async () => {
        const newCategory = await category.create(CATEGORY_1)
        const newCategoryId = newCategory.id as number
        const isCategoryDeleted = await repository.deleteCategory(newCategoryId)
        expect(isCategoryDeleted).toEqual(true)
    });

    it('should throw if category wasnt found', async () => {
        const INEXISTENT_ID = 500
        expect.assertions(1)
        try {
            await repository.deleteCategory(INEXISTENT_ID)
        } catch (err) {
            expect(err).toEqual(CategoryError.notFound())
        }
    });
    it('should throw if invalid id param', async () => {
        const INVALID_ID = -200
        expect.assertions(1)
        try {
            await repository.deleteCategory(INVALID_ID)
        } catch (err) {
            expect(err).toEqual(CategoryError.invalidId())
        }
    });
});

describe('modifyCategory', () => {
    it('should modify a category', async () => {
        await category.create(CATEGORY_1)
        const modifyCategoryProps: ICategoryEdit = { name: 'modified-category' }
        const modifiedCategory = await repository.modifyCategory(1, modifyCategoryProps)
        expect(modifiedCategory.name).toBe(modifyCategoryProps.name)
    });

    it('should throw if no category with given id', async () => {
        const INEXISTENT_ID = 5000
        const modifyCategoryProps: ICategoryEdit = { name: 'modified-category' }
        expect.assertions(1)
        try {
            await repository.modifyCategory(INEXISTENT_ID, modifyCategoryProps)
        } catch (err) {
            expect(err).toEqual(CategoryError.notFound())
        }
    });
});