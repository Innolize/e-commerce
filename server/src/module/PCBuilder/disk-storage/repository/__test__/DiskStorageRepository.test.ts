import 'reflect-metadata'
import dotenv from 'dotenv'
dotenv.config()
import { Sequelize } from "sequelize"
import { BrandModel } from "../../../../brand/module"
import { CategoryModel } from "../../../../category/module"
import { ProductModel } from "../../../../product/module"
import { DiskStorageModel } from "../../module"
import { DiskStorageRepository } from "../DiskStorageRepository"
import { DiskStorage } from '../../entities/DiskStorage'
import { GetDiskStorageReqDto } from '../../dto/getDiskStorageReqDto'
import { DiskStorageError } from '../../error/DiskStorageError'
import { IDiskStorageEdit } from '../../interface/IDiskStorageEdit'
import { CartItemModel } from '../../../../cart/module'

let sequelizeInstance: Sequelize
let diskStorageModel: typeof DiskStorageModel
let productModel: typeof ProductModel
let brandModel: typeof BrandModel
let categoryModel: typeof CategoryModel
let repository: DiskStorageRepository
let cartItemModel: typeof CartItemModel

beforeAll(async (done) => {
    try {
        sequelizeInstance = new Sequelize(<string>process.env.TEST_DATABASE_URL, {
            logging: false,
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            dialect: 'postgres'
        });
        await sequelizeInstance.drop({ cascade: true })
        diskStorageModel = DiskStorageModel.setup(sequelizeInstance)
        productModel = ProductModel.setup(sequelizeInstance)
        brandModel = BrandModel.setup(sequelizeInstance)
        categoryModel = CategoryModel.setup(sequelizeInstance)
        cartItemModel = CartItemModel.setup(sequelizeInstance)

        productModel.setupCategoryAssociation(categoryModel)
        productModel.setupBrandAssociation(brandModel)
        productModel.setupDiskStorageAssociation(diskStorageModel)
        diskStorageModel.setupProductAssociation(productModel)

        cartItemModel.setupProductAssociation(productModel)
        productModel.setupCartItemAssociation(cartItemModel)
        ProductModel.addDiskStorageHookOnDelete(productModel)

        repository = new DiskStorageRepository(diskStorageModel, sequelizeInstance, productModel)
        done();
    } catch (err) {
        console.log(err)
    }

});

beforeEach(async (done) => {
    await sequelizeInstance.sync({ force: true })
    await brandModel.create({ logo: null, name: 'brand-test-1' })
    await categoryModel.create({ name: 'category-test-1' })
    await productModel.create({ name: 'product-1', description: 'product-description-1', id_brand: 1, id_category: 1, image: null, price: 125, stock: true })
    await diskStorageModel.create({ id_product: 1, type: 'HDD', mbs: 500, total_storage: 4000, watts: 15 })
    await productModel.create({ name: 'product-2', description: 'product-description-2', id_brand: 1, id_category: 1, image: null, price: 200, stock: true })
    await diskStorageModel.create({ id_product: 2, type: 'HDD', mbs: 500, total_storage: 2000, watts: 30 })
    await productModel.create({ name: 'product-3', description: 'product-description-3', id_brand: 1, id_category: 1, image: null, price: 200, stock: true })
    await diskStorageModel.create({ id_product: 3, type: 'SSD', mbs: 120, total_storage: 500, watts: 60 })
    done();
})

afterAll(async () => {
    await sequelizeInstance.close();
});

describe('getDisks', () => {
    it('should get disks', async () => {
        const QUERY = { limit: 10, offset: 0 }
        const response = await repository.getDisks(QUERY)
        expect(response.count).toBe(3)
        expect(response.results.length).toBe(3)
        expect(response.results[0]).toBeInstanceOf(DiskStorage)
    });
    it('should get disks with type "SSD"', async () => {
        const QUERY: GetDiskStorageReqDto = { limit: 10, offset: 0, type: 'SSD' }
        const response = await repository.getDisks(QUERY)
        expect(response.count).toBe(1)
        expect(response.results.length).toBe(1)
        expect(response.results[0]).toBeInstanceOf(DiskStorage)
    });
});

describe('getSingleDisk', () => {
    it('should retrieve disk with given id', async () => {
        const DISK_ID = 2
        const response = await repository.getSingleDisk(DISK_ID)
        expect(response.id).toBe(DISK_ID)
    });
    it('should throw if disk was not found', async () => {
        const DISK_ID = 555
        expect.assertions(1)
        try {
            await repository.getSingleDisk(DISK_ID)
        } catch (err) {
            expect(err).toEqual(DiskStorageError.notFound())
        }
    });
});

describe('modifyDisk', () => {
    const DISK: IDiskStorageEdit = { watts: 500 }
    it('should modify disk correctly', async () => {
        const DISK_ID = 3

        const response = await repository.modifyDisk(DISK_ID, DISK)
        expect(response.id).toBe(3)
        expect(response.watts).toBe(DISK.watts)
    });

    it('should throw if disk not found', async () => {
        const DISK_ID = 62323
        expect.assertions(1)
        try {
            await repository.modifyDisk(DISK_ID, DISK)
        } catch (err) {
            expect(err).toEqual(DiskStorageError.notFound())
        }
    })
});

describe('deleteDisk', () => {
    it('should delete disk successfully', async () => {
        // const product = 
        const product = await productModel.findByPk(1)
        await product?.destroy()
        const DISK_ID = 1
        try {
            await repository.getSingleDisk(DISK_ID)
        } catch (err) {
            expect(err).toEqual(DiskStorageError.notFound())
        }
    });

    it('should throw if disk not found', async () => {
        const DISK_ID = 62323
        expect.assertions(1)
        try {
            await repository.deleteDisk(DISK_ID)
        } catch (err) {
            expect(err).toEqual(DiskStorageError.notFound())
        }
    })
});