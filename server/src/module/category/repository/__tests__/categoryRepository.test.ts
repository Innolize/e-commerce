import "reflect-metadata";
import dotenv from 'dotenv'
dotenv.config()
import { CategoryRepository } from '../categoryRepository'
import { Sequelize } from 'sequelize'
import { CategoryModel } from '../../model/categoryModel'
import { Category } from '../../entity/Category'

const sequelizeInstance = new Sequelize(<string>process.env.TEST_DATABASE_URL, {
    logging: false,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    dialect: 'postgres'

})
let category: typeof CategoryModel
let repository: CategoryRepository

// beforeAll(async () => {

// })

beforeEach(async (done) => {
    await sequelizeInstance.drop()
    category = CategoryModel.setup(sequelizeInstance)
    repository = new CategoryRepository(category)
    await sequelizeInstance.sync({ force: true });
    done();
});

const categorySample1 = new Category({ name: "test-category-1" })
const categorySample2 = new Category({ name: "test-category-2" })

// describe("Get all categories from database", () => {
//     it("Returns an array of 2 categories", async () => {
//         await category.create(categorySample1)
//         await category.create(categorySample2)
//         await expect(repository.getAllCategories()).resolves.toHaveLength(2)
//     })
//     it("Returns an empty array", async () => {
//         await expect(repository.getAllCategories()).resolves.toHaveLength(0)
//     })
// })

describe("Find category by id", () => {
    it("Return category with id '1'", async () => {
        await category.create(categorySample1)
        await category.create(categorySample2)
        const response = await repository.findCategoryById(2)
        expect(response.name).toBe("test-category-2")
        expect(response).toBeInstanceOf(Category)
    })
    it("Returns an error by not finding category", async () => {
        await expect(repository.findCategoryById(125)).rejects.toThrowError()
    })
})

describe("Create category", () => {
    it("Create a category", async () => {
        const response = await repository.createCategory({ name: "new-category" })
        expect(response.name).toBe("new-category")
        expect(response).toBeInstanceOf(Category)
    })
})

describe("Delete category", () => {

    it("deletes a category successfully", async () => {
        await category.create(categorySample1)
        await expect(repository.deleteCategory(1)).resolves.toBe(true)
    })
    it("Deletes a category by id", async () => {
        await expect(repository.deleteCategory(0)).rejects.toThrowError()
    })
    it("Return error trying to delete an inexistence category ", async () => {
        await expect(repository.deleteCategory(15)).rejects.toThrowError()
    })
})

describe("Modifiy category", () => {
    it("Updates category", async () => {
        await category.create(categorySample1)
        const response = await repository.modifyCategory({ id: 1, name: "updated-category" })
        expect(response.name).toBe("updated-category")
    })
    it("Update category without id should throw an error", async () => {
        
        await expect(repository.modifyCategory({ id: 15, name: "updated-category" })).rejects.toThrowError()
    })
})