import 'reflect-metadata'
import dotenv from 'dotenv'
dotenv.config()

import { Sequelize } from 'sequelize'
import { ProductModel } from '../../../../product/module'
import { BrandModel } from '../../../../brand/module'
import { CategoryModel } from '../../../../category/module'
import { RamModel } from '../../module'
import { CartItemModel } from '../../../../cart/module'
import { RamRepository } from '../RamRepository'
import { Product } from '../../../../product/entity/Product'
import { Ram } from '../../entities/Ram'
import { GetRamReqDto } from '../../dto/getRamReqDto'
import { RamError } from '../../error/RamError'
import { IRam_Product } from '../../interface/IRamCreate'
import { IRamEdit } from '../../interface/IRamEdit'

let sequelizeInstance: Sequelize
let ramModel: typeof RamModel
let productModel: typeof ProductModel
let brandModel: typeof BrandModel
let categoryModel: typeof CategoryModel
let repository: RamRepository

beforeAll(async (done) => {
    try {
        sequelizeInstance = new Sequelize(<string>process.env.TEST_DATABASE_URL, {
            logging: false,
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            dialect: 'postgres'
        });
        await sequelizeInstance.drop({ cascade: true })
        ramModel = RamModel.setup(sequelizeInstance)
        productModel = ProductModel.setup(sequelizeInstance)
        brandModel = BrandModel.setup(sequelizeInstance)
        categoryModel = CategoryModel.setup(sequelizeInstance)
        CartItemModel.setup(sequelizeInstance)

        productModel.setupCategoryAssociation(categoryModel)
        productModel.setupBrandAssociation(brandModel)
        productModel.setupRamAssociation(ramModel)

        CartItemModel.setupProductAssociation(productModel)
        productModel.setupCartItemAssociation(CartItemModel)
        RamModel.setupProductAssociation(productModel)
        RamModel.addRamHookOnDelete(productModel)
        repository = new RamRepository(ramModel)
        done();
    } catch (err) {
        console.log(err)
    }

});

beforeEach(async (done) => {
    await sequelizeInstance.sync({ force: true })
    await sequelizeInstance.sync({ force: true })
    await brandModel.create({ logo: null, name: 'brand-test-1' })
    await categoryModel.create({ name: 'category-test-1' })
    const product1 = new Product('product-1', null, 'product-description-1', 100, true, 1, 1)
    const product2 = new Product('product-2', null, 'product-description-2', 200, true, 1, 1)
    const product3 = new Product('product-3', null, 'product-description-3', 300, true, 1, 1)
    await ramModel.create({ max_frec: 1200, memory: 4000, min_frec: 1000, ram_version: 'DDR2', watts: 70, product: product1 }, { include: RamModel.associations.product })
    await ramModel.create({ max_frec: 2400, memory: 8000, min_frec: 2000, ram_version: 'DDR3', watts: 120, product: product2 }, { include: RamModel.associations.product })
    await ramModel.create({ max_frec: 3600, memory: 2000, min_frec: 3000, ram_version: 'DDR4', watts: 90, product: product3 }, { include: RamModel.associations.product })
    done();
})

afterAll(async () => {
    await sequelizeInstance.close();
});

describe('getAll', () => {
    it('should get power supplies', async () => {
        const QUERY = { limit: 10, offset: 0 }
        const response = await repository.getAll(QUERY)
        expect(response.count).toBe(3)
        expect(response.results.length).toBe(3)
        expect(response.results[0]).toBeInstanceOf(Ram)
    });
    it('should get power supplies with 100 watts', async () => {
        const QUERY: GetRamReqDto = { limit: 10, offset: 0, ram_version: 'DDR2', max_frec: 1200, min_frec: 1000 }
        const response = await repository.getAll(QUERY)
        expect(response.count).toBe(1)
        expect(response.results.length).toBe(1)
        expect(response.results[0]).toBeInstanceOf(Ram)
    });
});

describe('getSingle', () => {
    it('should retrieve ram with given id', async () => {
        const RAM_ID = 2
        const response = await repository.getSingle(RAM_ID)
        expect(response.id).toBe(RAM_ID)
        expect(response).toBeInstanceOf(Ram)
    });
    it('should throw if ram  was not found', async () => {
        const INVALID_RAM_ID = 555
        expect.assertions(1)
        try {
            await repository.getSingle(INVALID_RAM_ID)
        } catch (err) {
            expect(err).toEqual(RamError.notFound())
        }
    });
});

describe('create', () => {
    it('should create a new ram ', async () => {
        const product1 = new Product('product-name-1', null, 'product-description-1', 100, true, 1, 1)
        const ram: IRam_Product = { ram_version:'DDR3',max_frec:3000,memory:8000,min_frec:2000, product: product1, watts: 100 }
        const ramCreated = await repository.create(ram)
        const ramId = ramCreated.id as number
        const foundRam = await ramModel.findByPk(ramId)
        expect(foundRam?.watts).toBe(ram.watts)
        expect(foundRam?.memory).toBe(ram.memory)
        const productCreatedId = ramCreated.product?.id
        const foundProductCreated = await productModel.findByPk(productCreatedId)
        expect(foundProductCreated?.name).toBe(product1.name)
        expect(foundProductCreated?.image).toBe(product1.image)
    });

});

describe('modify', () => {
    const ram: IRamEdit = { watts: 500 }
    it('should modify ram correctly', async () => {
        const RAM_ID = 3
        const response = await repository.modify(RAM_ID, ram)
        expect(response.id).toBe(3)
        expect(response.watts).toBe(ram.watts)
    });

    it('should throw if motherboard is not found', async () => {
        const RAM_ID = 62323
        expect.assertions(1)
        try {
            await repository.modify(RAM_ID, ram)
        } catch (err) {
            expect(err).toEqual(RamError.notFound())
        }
    })
});

describe('delete', () => {
    it('should delete ram if product is deleted', async () => {
        expect.assertions(1)
        const RAM_ID = 1
        const product = await productModel.findByPk(1)
        await product?.destroy()
        try {
            await repository.getSingle(RAM_ID)
        } catch (err) {
            expect(err).toEqual(RamError.notFound())
        }
    });

    it('should throw if ram is not found', async () => {
        expect.assertions(1)
        const RAM_ID = 62323
        try {
            await repository.delete(RAM_ID)
        } catch (err) {
            expect(err).toEqual(RamError.notFound())
        }
    })

    it('should delete ram successfully', async () => {
        const response = await repository.delete(1)
        expect(response).toStrictEqual(true)
    });
});