import 'reflect-metadata'
import dotenv from 'dotenv'
import { Sequelize } from 'sequelize'
import { MotherboardModel } from '../../module'
import { ProductModel } from '../../../../product/module'
import { CategoryModel } from '../../../../category/module'
import { BrandModel } from '../../../../brand/module'
import { CartItemModel } from '../../../../cart/module'
import { MotherboardRepository } from '../motherboardRepository'
import { Motherboard } from '../../entity/Motherboard'
import { GetMotherboardReqDto } from '../../dto/getMotherboardsReqDto'
import { Product } from '../../../../product/entity/Product'
import { MotherboardError } from '../../error/MotherboardError'
import { IMotherboard_Product } from '../../interface/IMotherboardCreate'
import { IMotherboardEdit } from '../../interface/IMotherboardEdit'
dotenv.config()

let sequelizeInstance: Sequelize
let motherboardModel: typeof MotherboardModel
let productModel: typeof ProductModel
let brandModel: typeof BrandModel
let categoryModel: typeof CategoryModel
let repository: MotherboardRepository

beforeAll(async (done) => {
    try {
        sequelizeInstance = new Sequelize(<string>process.env.TEST_DATABASE_URL, {
            logging: false,
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            dialect: 'postgres'
        });
        await sequelizeInstance.drop({ cascade: true })
        motherboardModel = MotherboardModel.setup(sequelizeInstance)
        productModel = ProductModel.setup(sequelizeInstance)
        brandModel = BrandModel.setup(sequelizeInstance)
        categoryModel = CategoryModel.setup(sequelizeInstance)
        CartItemModel.setup(sequelizeInstance)

        productModel.setupCategoryAssociation(categoryModel)
        productModel.setupBrandAssociation(brandModel)
        productModel.setupMotherboardAssociation(motherboardModel)

        CartItemModel.setupProductAssociation(productModel)
        productModel.setupCartItemAssociation(CartItemModel)
        MotherboardModel.setupProductAssociation(productModel)
        MotherboardModel.addMotherboardHookOnDelete(productModel)
        repository = new MotherboardRepository(motherboardModel)
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
    await motherboardModel.create({ cpu_brand: 'AMD', cpu_socket: 'AX1', max_frec: 1000, min_frec: 100, model_size: 'ATX', ram_version: 'DDR1', video_socket: 'DDR4', watts: 100, product: product1 }, { include: MotherboardModel.associations.product })
    await motherboardModel.create({ cpu_brand: 'INTEL', cpu_socket: 'AH2', max_frec: 2000, min_frec: 200, model_size: 'Micro-ATX', ram_version: 'DDR1', video_socket: 'DDR6', watts: 200, product: product2 }, { include: MotherboardModel.associations.product })
    await motherboardModel.create({ cpu_brand: 'AMD', cpu_socket: 'JPK3', max_frec: 3000, min_frec: 300, model_size: 'ATX', ram_version: 'DDR1', video_socket: 'DDR5', watts: 300, product: product3 }, { include: MotherboardModel.associations.product })
    done();
})

afterAll(async () => {
    await sequelizeInstance.close();
});

describe('getAll', () => {
    it('should get disks', async () => {
        const QUERY = { limit: 10, offset: 0 }
        const response = await repository.getAll(QUERY)
        expect(response.count).toBe(3)
        expect(response.results.length).toBe(3)
        expect(response.results[0]).toBeInstanceOf(Motherboard)
    });
    it('should get disks with cpu brand "AMD"', async () => {
        const QUERY: GetMotherboardReqDto = { limit: 10, offset: 0, cpu_brand: 'AMD' }
        const response = await repository.getAll(QUERY)
        expect(response.count).toBe(2)
        expect(response.results.length).toBe(2)
        expect(response.results[0]).toBeInstanceOf(Motherboard)
    });
});

describe('getSingle', () => {
    it('should retrieve motherboard with given id', async () => {
        const MOTHERBOARD_ID = 2
        const response = await repository.getSingle(MOTHERBOARD_ID)
        expect(response.id).toBe(MOTHERBOARD_ID)
        expect(response).toBeInstanceOf(Motherboard)
    });
    it('should throw if motherboard was not found', async () => {
        const INVALID_MOTHERBOARD_ID = 555
        expect.assertions(1)
        try {
            await repository.getSingle(INVALID_MOTHERBOARD_ID)
        } catch (err) {
            expect(err).toEqual(MotherboardError.notFound())
        }
    });
});

describe('create', () => {
    it('should create a new motherboard ', async () => {
        const product1 = new Product('product-name-1', null, 'product-description-1', 100, true, 1, 1)
        const motherboard: IMotherboard_Product = { cpu_brand: 'AMD', cpu_socket: 'test-socket', max_frec: 2000, min_frec: 1000, model_size: 'ATX', ram_version: 'DDR1', video_socket: 'DDR4', watts: 200, product: product1 }
        const motherboardCreated = await repository.create(motherboard)
        const motherboardId = motherboardCreated.id as number
        const foundDiskCreated = await motherboardModel.findByPk(motherboardId)
        expect(foundDiskCreated?.min_frec).toBe(motherboard.min_frec)
        expect(foundDiskCreated?.max_frec).toBe(motherboard.max_frec)
        const productCreatedId = motherboardCreated.product?.id
        const foundProductCreated = await productModel.findByPk(productCreatedId)
        expect(foundProductCreated?.name).toBe(product1.name)
        expect(foundProductCreated?.image).toBe(product1.image)
    });

});

describe('modify', () => {
    const motherboard: IMotherboardEdit = { watts: 500 }
    it('should modify disk correctly', async () => {
        const MOTHERBOARD_ID = 3

        const response = await repository.modify(MOTHERBOARD_ID, motherboard)
        expect(response.id).toBe(3)
        expect(response.watts).toBe(motherboard.watts)
    });

    it('should throw if motherboard is not found', async () => {
        const MOTHERBOARD_ID = 62323
        expect.assertions(1)
        try {
            await repository.modify(MOTHERBOARD_ID, motherboard)
        } catch (err) {
            expect(err).toEqual(MotherboardError.notFound())
        }
    })
});

describe('delete', () => {
    it('should delete motherboard if product is deleted', async () => {
        expect.assertions(1)
        const MOTHERBOARD_ID = 1
        const product = await productModel.findByPk(1)
        await product?.destroy()
        try {
            await repository.getSingle(MOTHERBOARD_ID)
        } catch (err) {
            expect(err).toEqual(MotherboardError.notFound())
        }
    });

    it('should throw if motherboard is not found', async () => {
        expect.assertions(1)
        const MOTHERBOARD_ID = 62323
        try {
            await repository.delete(MOTHERBOARD_ID)
        } catch (err) {
            expect(err).toEqual(MotherboardError.notFound())
        }
    })

    it('should delete motherboard successfully', async () => {
        const response = await repository.delete(1)
        expect(response).toStrictEqual(true)
    });
});