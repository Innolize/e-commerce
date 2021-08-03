import "reflect-metadata";
import dotenv from 'dotenv'
dotenv.config()
import { BrandRepository } from '../brandRepository'
import { Sequelize } from 'sequelize'
import { BrandModel } from '../../model/brandModel'
import { Brand } from '../../entity/Brand'
import { BrandError } from "../../error/BrandError";

let sequelizeInstance: Sequelize
let brand: typeof BrandModel
let repository: BrandRepository

beforeAll(async (done) => {
    sequelizeInstance = new Sequelize(<string>process.env.TEST_DATABASE_URL, {
        logging: false,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        dialect: 'postgres'
    })
    await sequelizeInstance.drop({cascade: true})
    done();
})

beforeEach(async (done) => {
    brand = BrandModel.setup(sequelizeInstance)
    repository = new BrandRepository(brand)
    await sequelizeInstance.sync({ force: true });
    done();
});

afterAll(async (done) => {
    await sequelizeInstance.drop({ cascade: true });
    await sequelizeInstance.close();
    done();
});

const brandSample1 = new Brand("test-brand-1", "test-brand-logo-1")
const brandSample2 = new Brand("test-brand-2", "test-brand-logo-2")

const INEXISTENT_ID = 125

describe("Get all brands from database", () => {
    it("Returns an array of 2 brands", async () => {
        await brand.create(brandSample1)
        await brand.create(brandSample2)

        const response = await repository.getAllBrands({ limit: 10, offset: 0 })
        expect(response.results).toHaveLength(2)
    })
    it("Returns an empty array", async () => {
        const response = await repository.getAllBrands({ limit: 10, offset: 0 })
        expect(response.count).toBe(0)
        expect(response.results).toHaveLength(0)
    })
})

describe("Find category by id", () => {
    it("Return category with id '1'", async () => {
        await brand.create(brandSample1)
        await brand.create(brandSample2)
        const response = await repository.getById(2)
        expect(response.name).toBe("test-brand-2")
        expect(response).toBeInstanceOf(Brand)
    })
    it("should throw if category not found", async () => {
        expect.assertions(1)
        try {
            await repository.getById(125)
        } catch (err) {
            expect(err).toBeInstanceOf(BrandError)
        }
    })
    it("should throw if category equal to 0", async () => {
        expect.assertions(1)
        try {
            await repository.getById(0)
        } catch (err) {
            expect(err).toBeInstanceOf(BrandError)
        }
    })
})

describe("Creates a brand", () => {
    it("Creates a new brand", async () => {
        const response = await repository.createBrand({ name: "new-brand", logo: "new-brand-logo" })
        expect(response.name).toBe("new-brand")
        expect(response).toBeInstanceOf(Brand)
    })
})

describe("Delete brand", () => {

    it("should deletes a brand successfully", async () => {
        await brand.create(brandSample1)
        const deletedBrand = await repository.deleteBrand(1)
        expect(deletedBrand).toBe(true)
    })
    it("should throw of inexistent brand", async () => {
        expect.assertions(1)
        try {
            await repository.deleteBrand(INEXISTENT_ID)
        } catch (err) {
            expect(err).toBeInstanceOf(BrandError)
        }
    })

    it('should throw if invalid id', async () => {
        const NEGATIVE_ID = -5
        expect.assertions(1)
        try {
            await repository.deleteBrand(NEGATIVE_ID)
        } catch (err) {
            expect(err).toEqual(BrandError.invalidId())
        }
    });
})

describe("Modifiy brand", () => {
    it("should updates brand", async () => {
        const createdBrand = await brand.create(brandSample1)
        const id = createdBrand.id as number
        const response = await repository.modifyBrand(id, { name: "updated-brand" })
        expect(response.name).toBe("updated-brand")
    })
    it("Update brand without id should throw an error", async () => {
        await expect(repository.modifyBrand(INEXISTENT_ID, { name: "updated-brand" })).rejects.toThrowError()
    })
})