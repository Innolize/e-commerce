import 'reflect-metadata'
import dotenv from 'dotenv'
dotenv.config()

import { Sequelize } from 'sequelize'
import { ProductModel } from '../../../../product/module'
import { BrandModel } from '../../../../brand/module'
import { CategoryModel } from '../../../../category/module'
import { PowerSupplyModel } from '../../module'
import { CartItemModel } from '../../../../cart/module'
import { PowerSupplyRepository } from '../PowerSupplyRepository'
import { Product } from '../../../../product/entity/Product'
import { PowerSupply } from '../../entities/PowerSupply'
import { GetPowerSupplyReqDto } from '../../dto/getPowerSupplyReqDto'
import { PowerSupplyError } from '../../error/PowerSupplyError'
import { IPowerSupply_Product } from '../../interface/IPowerSupplyCreate'
import { IPowerSupplyEdit } from '../../interface/IPowerSupplyEdit'

let sequelizeInstance: Sequelize
let powerSupplyModel: typeof PowerSupplyModel
let productModel: typeof ProductModel
let brandModel: typeof BrandModel
let categoryModel: typeof CategoryModel
let repository: PowerSupplyRepository

beforeAll(async (done) => {
    try {
        sequelizeInstance = new Sequelize(<string>process.env.TEST_DATABASE_URL, {
            logging: false,
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            dialect: 'postgres'
        });
        await sequelizeInstance.drop({ cascade: true })
        powerSupplyModel = PowerSupplyModel.setup(sequelizeInstance)
        productModel = ProductModel.setup(sequelizeInstance)
        brandModel = BrandModel.setup(sequelizeInstance)
        categoryModel = CategoryModel.setup(sequelizeInstance)
        CartItemModel.setup(sequelizeInstance)

        productModel.setupCategoryAssociation(categoryModel)
        productModel.setupBrandAssociation(brandModel)
        productModel.setupPowerSupplyAssociation(powerSupplyModel)

        CartItemModel.setupProductAssociation(productModel)
        productModel.setupCartItemAssociation(CartItemModel)
        PowerSupplyModel.setupProductAssociation(productModel)
        PowerSupplyModel.addPowerSupplyHookOnDelete(productModel)
        repository = new PowerSupplyRepository(powerSupplyModel)
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
    await powerSupplyModel.create({ certification: 'GENERIC', watts: 100, product: product1 }, { include: PowerSupplyModel.associations.product })
    await powerSupplyModel.create({ certification: 'PLUS GOLD', watts: 200, product: product2 }, { include: PowerSupplyModel.associations.product })
    await powerSupplyModel.create({ certification: 'PLUS PLATINUM', watts: 300, product: product3 }, { include: PowerSupplyModel.associations.product })
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
        expect(response.results[0]).toBeInstanceOf(PowerSupply)
    });
    it('should get power supplies with 100 watts', async () => {
        const QUERY: GetPowerSupplyReqDto = { limit: 10, offset: 0, watts: 100 }
        const response = await repository.getAll(QUERY)
        expect(response.count).toBe(1)
        expect(response.results.length).toBe(1)
        expect(response.results[0]).toBeInstanceOf(PowerSupply)
    });
});

describe('getSingle', () => {
    it('should retrieve power supply with given id', async () => {
        const POWERSUPPLY_ID = 2
        const response = await repository.getSingle(POWERSUPPLY_ID)
        expect(response.id).toBe(POWERSUPPLY_ID)
        expect(response).toBeInstanceOf(PowerSupply)
    });
    it('should throw if power supply  was not found', async () => {
        const INVALID_POWERSUPPLY_ID = 555
        expect.assertions(1)
        try {
            await repository.getSingle(INVALID_POWERSUPPLY_ID)
        } catch (err) {
            expect(err).toEqual(PowerSupplyError.notFound())
        }
    });
});

describe('create', () => {
    it('should create a new power supply ', async () => {
        const product1 = new Product('product-name-1', null, 'product-description-1', 100, true, 1, 1)
        const powerSupply: IPowerSupply_Product = { certification: 'PLUS PLATINUM', product: product1, watts: 100 }
        const powerSupplyCreated = await repository.create(powerSupply)
        const powerSupplyId = powerSupplyCreated.id as number
        const foundPowerSupply = await powerSupplyModel.findByPk(powerSupplyId)
        expect(foundPowerSupply?.watts).toBe(powerSupply.watts)
        expect(foundPowerSupply?.certification).toBe(powerSupply.certification)
        const productCreatedId = powerSupplyCreated.product?.id
        const foundProductCreated = await productModel.findByPk(productCreatedId)
        expect(foundProductCreated?.name).toBe(product1.name)
        expect(foundProductCreated?.image).toBe(product1.image)
    });

});

describe('modify', () => {
    const powerSupply: IPowerSupplyEdit = { watts: 500 }
    it('should modify power supply correctly', async () => {
        const POWER_SUPPLY_ID = 3
        const response = await repository.modify(POWER_SUPPLY_ID, powerSupply)
        expect(response.id).toBe(3)
        expect(response.watts).toBe(powerSupply.watts)
    });

    it('should throw if motherboard is not found', async () => {
        const POWER_SUPPLY_ID = 62323
        expect.assertions(1)
        try {
            await repository.modify(POWER_SUPPLY_ID, powerSupply)
        } catch (err) {
            expect(err).toEqual(PowerSupplyError.notFound())
        }
    })
});

describe('delete', () => {
    it('should delete power supply if product is deleted', async () => {
        expect.assertions(1)
        const POWER_SUPPLY_ID = 1
        const product = await productModel.findByPk(1)
        await product?.destroy()
        try {
            await repository.getSingle(POWER_SUPPLY_ID)
        } catch (err) {
            expect(err).toEqual(PowerSupplyError.notFound())
        }
    });

    it('should throw if power supply is not found', async () => {
        expect.assertions(1)
        const POWER_SUPPLY_ID = 62323
        try {
            await repository.delete(POWER_SUPPLY_ID)
        } catch (err) {
            expect(err).toEqual(PowerSupplyError.notFound())
        }
    })

    it('should delete power supply successfully', async () => {
        const response = await repository.delete(1)
        expect(response).toStrictEqual(true)
    });
});