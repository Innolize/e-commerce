import 'reflect-metadata'
import dotenv from 'dotenv'
dotenv.config()

import { Sequelize } from 'sequelize'
import { ProductModel } from '../../../../product/module'
import { BrandModel } from '../../../../brand/module'
import { CategoryModel } from '../../../../category/module'
import { ProcessorModel } from '../../module'
import { ProcessorRepository } from '../ProcessorRepository'
import { CartItemModel } from '../../../../cart/module'
import { Product } from '../../../../product/entity/Product'
import { Processor } from '../../entities/Processor'
import { GetProcessorReqDto } from '../../dto/getProcessorsReqDto'
import { ProcessorError } from '../../error/ProcessorError'
import { IProcessor_Product } from '../../interface/IProcessorCreate'
import { IProcessorEdit } from '../../interface/IProcessorEdit'

let sequelizeInstance: Sequelize
let processorModel: typeof ProcessorModel
let productModel: typeof ProductModel
let brandModel: typeof BrandModel
let categoryModel: typeof CategoryModel
let repository: ProcessorRepository

beforeAll(async (done) => {
    try {
        sequelizeInstance = new Sequelize(<string>process.env.TEST_DATABASE_URL, {
            logging: false,
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            dialect: 'postgres'
        });
        await sequelizeInstance.drop({ cascade: true })
        processorModel = ProcessorModel.setup(sequelizeInstance)
        productModel = ProductModel.setup(sequelizeInstance)
        brandModel = BrandModel.setup(sequelizeInstance)
        categoryModel = CategoryModel.setup(sequelizeInstance)
        CartItemModel.setup(sequelizeInstance)

        productModel.setupCategoryAssociation(categoryModel)
        productModel.setupBrandAssociation(brandModel)
        productModel.setupProcessorAssociation(processorModel)

        CartItemModel.setupProductAssociation(productModel)
        productModel.setupCartItemAssociation(CartItemModel)
        ProcessorModel.setupProductAssociation(productModel)
        ProcessorModel.addProcessorHookOnDelete(productModel)
        repository = new ProcessorRepository(ProcessorModel)
        done();
    } catch (err) {
        console.log(err)
    }

});

beforeEach(async (done) => {
    await sequelizeInstance.sync({ force: true })
    await brandModel.create({ logo: null, name: 'brand-test-1' })
    await categoryModel.create({ name: 'category-test-1' })
    const product1 = new Product('product-1', null, 'product-description-1', 100, true, 1, 1)
    const product2 = new Product('product-2', null, 'product-description-2', 200, true, 1, 1)
    const product3 = new Product('product-3', null, 'product-description-3', 300, true, 1, 1)
    await processorModel.create({ cores: 2, frecuency: 1300, socket: 'ax1', watts: 70, product: product1 }, { include: ProcessorModel.associations.product })
    await processorModel.create({ cores: 2, frecuency: 1400, socket: 'ax2', watts: 70, product: product2 }, { include: ProcessorModel.associations.product })
    await processorModel.create({ cores: 2, frecuency: 1400, socket: 'ax3', watts: 70, product: product3 }, { include: ProcessorModel.associations.product })
    done();
})

afterAll(async () => {
    await sequelizeInstance.close();
});

describe('getAll', () => {
    it('should get processors', async () => {
        const QUERY = { limit: 10, offset: 0 }
        const response = await repository.getAll(QUERY)
        expect(response.count).toBe(3)
        expect(response.results.length).toBe(3)
        expect(response.results[0]).toBeInstanceOf(Processor)
    });
    it('should get processors with socket "ax1"', async () => {
        const QUERY: GetProcessorReqDto = { limit: 10, offset: 0, socket: 'ax1' }
        const response = await repository.getAll(QUERY)
        expect(response.count).toBe(1)
        expect(response.results.length).toBe(1)
        expect(response.results[0]).toBeInstanceOf(Processor)
    });
});

describe('getSingle', () => {
    it('should retrieve power supply with given id', async () => {
        const PROCESSOR_ID = 2
        const response = await repository.getSingle(PROCESSOR_ID)
        expect(response.id).toBe(PROCESSOR_ID)
        expect(response).toBeInstanceOf(Processor)
    });
    it('should throw if power supply  was not found', async () => {
        const INVALID_PROCESSOR_ID = 555
        expect.assertions(1)
        try {
            await repository.getSingle(INVALID_PROCESSOR_ID)
        } catch (err) {
            expect(err).toEqual(ProcessorError.notFound())
        }
    });
});

describe('create', () => {
    it('should create a new power supply ', async () => {
        const product1 = new Product('product-name-1', null, 'product-description-1', 100, true, 1, 1)
        const processor: IProcessor_Product = { watts: 200, cores: 3, frecuency: 1200, socket: 'ax1', product: product1 }
        const processorCreated = await repository.create(processor)
        const processorId = processorCreated.id as number
        const foundProcessor = await processorModel.findByPk(processorId)
        expect(foundProcessor?.watts).toBe(processor.watts)
        expect(foundProcessor?.cores).toBe(processor.cores)
        const productCreatedId = processorCreated.product?.id
        const foundProductCreated = await productModel.findByPk(productCreatedId)
        expect(foundProductCreated?.name).toBe(product1.name)
        expect(foundProductCreated?.image).toBe(product1.image)
    });

});

describe('modify', () => {
    const processor: IProcessorEdit = { watts: 500 }
    it('should modify power supply correctly', async () => {
        const POWER_SUPPLY_ID = 3
        const response = await repository.modify(POWER_SUPPLY_ID, processor)
        expect(response.id).toBe(3)
        expect(response.watts).toBe(processor.watts)
    });

    it('should throw if motherboard is not found', async () => {
        const POWER_SUPPLY_ID = 62323
        expect.assertions(1)
        try {
            await repository.modify(POWER_SUPPLY_ID, processor)
        } catch (err) {
            expect(err).toEqual(ProcessorError.notFound())
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
            expect(err).toEqual(ProcessorError.notFound())
        }
    });

    it('should throw if power supply is not found', async () => {
        expect.assertions(1)
        const POWER_SUPPLY_ID = 62323
        try {
            await repository.delete(POWER_SUPPLY_ID)
        } catch (err) {
            expect(err).toEqual(ProcessorError.notFound())
        }
    })

    it('should delete power supply successfully', async () => {
        const response = await repository.delete(1)
        expect(response).toStrictEqual(true)
    });
});