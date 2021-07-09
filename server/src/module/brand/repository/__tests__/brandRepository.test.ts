import "reflect-metadata";
import dotenv from 'dotenv'
dotenv.config()
import { BrandRepository } from '../brandRepository'
import { Sequelize } from 'sequelize'
import { BrandModel } from '../../model/brandModel'
import { Brand } from '../../entity/Brand'

const sequelizeInstance = new Sequelize(<string>process.env.TEST_DATABASE_URL, {
    logging: false,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    dialect: 'postgres'
})
let brand: typeof BrandModel
let repository: BrandRepository

// beforeAll(async () => {

// })

// beforeEach(async (done) => {
//     await sequelizeInstance.drop()
//     brand = BrandModel.setup(sequelizeInstance)
//     repository = new BrandRepository(brand)
//     await sequelizeInstance.sync({ force: true });
//     done();
// });

// const brandSample1 = new Brand("test-brand-1", "test-brand-logo-1")
// const brandSample2 = new Brand("test-brand-2", "test-brand-logo-2")

// describe("Get all brands from database", () => {
//     it("Returns an array of 2 brands", async () => {
//         await brand.create(brandSample1)
//         await brand.create(brandSample2)
//         await expect(repository.getAllBrands()).resolves.toHaveLength(2)
//     })
//     it("Returns an empty array", async () => {
//         await expect(repository.getAllBrands()).resolves.toHaveLength(0)
//     })
// })

// describe("Find category by id", () => {
//     it("Return category with id '1'", async () => {
//         await brand.create(brandSample1)
//         await brand.create(brandSample2)
//         const response = await repository.getById(2)
//         expect(response.name).toBe("test-brand-2")
//         expect(response).toBeInstanceOf(Brand)
//     })
//     it("Returns an error by not finding category", async () => {
//         await expect(repository.getById(125)).rejects.toThrowError()
//     })
//     it("Returns an error by passing an id equal to 0", async () => {
//         await expect(repository.getById(0)).rejects.toThrowError()
//     })
// })

// describe("Creates a brand", () => {
//     it("Creates a new brand", async () => {
//         const response = await repository.createBrand({ name: "new-brand", logo: "new-brand-logo" })
//         expect(response.name).toBe("new-brand")
//         expect(response).toBeInstanceOf(Brand)
//     })
// })

// describe("Delete brand", () => {

//     it("deletes a brand successfully", async () => {
//         await brand.create(brandSample1)
//         await expect(repository.deleteBrand(1)).resolves.toBe(true)
//     })
//     it("Deletes a brand by id", async () => {
//         await expect(repository.deleteBrand(0)).rejects.toThrowError()
//     })
//     it("Return error trying to delete an inexistence brand ", async () => {
//         await expect(repository.deleteBrand(15)).rejects.toThrowError()
//     })
// })

// describe("Modifiy brand", () => {
//     it("Updates brand", async () => {
//         await brand.create(brandSample1)
//         const response = await repository.modifyBrand({ id: 1, name: "updated-brand" })
//         expect(response.name).toBe("updated-brand")
//     })
//     it("Update brand without id should throw an error", async () => {

//         await expect(repository.modifyBrand({ id: 15, name: "updated-brand" })).rejects.toThrowError()
//     })
// })