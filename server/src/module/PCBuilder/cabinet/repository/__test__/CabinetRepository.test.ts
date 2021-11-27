import 'reflect-metadata'
import dotenv from 'dotenv'
dotenv.config();
import { Sequelize } from 'sequelize'
import { BrandModel } from '../../../../brand/module';
import { CategoryModel } from '../../../../category/module';
import { ProductModel } from '../../../../product/module';
import { CabinetModel } from '../../module';
import { CabinetRepository } from '../CabinetRepository';
import { Cabinet } from '../../entities/Cabinet';
import { CabinetError } from '../../error/CabinetError'
import { Product } from '../../../../product/entity/Product';
import { ICabinetProductless } from '../../interface/ICabinetCreate';
import { ICabinetEdit } from '../../interface/ICabinetEdit';

let sequelizeInstance: Sequelize
let cabinetModel: typeof CabinetModel
let productModel: typeof ProductModel
let brandModel: typeof BrandModel
let categoryModel: typeof CategoryModel
let repository: CabinetRepository


beforeAll(async () => {
    try {
        console.log('aca funciono')
        sequelizeInstance = new Sequelize(<string>process.env.TEST_DATABASE_URL, {
            logging: false,
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            dialect: 'postgres'
        });
        await sequelizeInstance.drop({ cascade: true })
        cabinetModel = CabinetModel.setup(sequelizeInstance)
        productModel = ProductModel.setup(sequelizeInstance)
        brandModel = BrandModel.setup(sequelizeInstance)
        categoryModel = CategoryModel.setup(sequelizeInstance)
        productModel.setupCategoryAssociation(categoryModel)
        productModel.setupBrandAssociation(brandModel)
        cabinetModel.setupProductAssociation(productModel)
        repository = new CabinetRepository(cabinetModel, sequelizeInstance, productModel)

    } catch (err) {
        console.log(err)
    }

});

beforeEach(async (done) => {
    await sequelizeInstance.sync({ force: true })
    await brandModel.create({ logo: null, name: 'brand-test-1' })
    await categoryModel.create({ name: 'category-test-1' })
    await productModel.create({ name: 'product-1', description: 'product-description-1', id_brand: 1, id_category: 1, image: null, price: 125, stock: true })
    await cabinetModel.create({ generic_pws: true, id_product: 1, size: 'ATX' })
    await productModel.create({ name: 'product-2', description: 'product-description-2', id_brand: 1, id_category: 1, image: null, price: 200, stock: true })
    await cabinetModel.create({ generic_pws: true, id_product: 2, size: 'Micro-ATX' })
    await productModel.create({ name: 'product-3', description: 'product-description-3', id_brand: 1, id_category: 1, image: null, price: 200, stock: true })
    await cabinetModel.create({ generic_pws: false, id_product: 3, size: 'Micro-ATX' })
    done();
})

afterAll(async () => {
    await sequelizeInstance.close();
});

describe('getCabinets', () => {
    it('should retrieve three cabinets', async () => {
        const result = await repository.getCabinets({ limit: 10, offset: 0 })
        expect(result.count).toBe(3)
        expect(result.results.length).toBe(3)
        expect(result.results[0]).toBeInstanceOf(Cabinet)
    });
    it('should only retrieve cabinets with given size', async () => {
        const result = await repository.getCabinets({ limit: 10, offset: 0, size: 'Micro-ATX' })
        expect(result.count).toBe(2)
        expect(result.results.length).toBe(2)
    });

});

describe('getSingleCabinet', () => {
    it('should retrieve cabinet with given id', async () => {
        const CABINET_ID = 2
        const result = await repository.getSingleCabinet(CABINET_ID)
        expect(result.id).toBe(CABINET_ID)
    });

    it('should throw if no cabinet was found', async () => {
        const INEXISTENT_ID = 512
        expect.assertions(1)
        try {
            await repository.getSingleCabinet(INEXISTENT_ID)
        } catch (err) {
            expect(err).toEqual(CabinetError.notFound())
        }
    });
});

describe('createCabinet', () => {
    it('should create cabinet', async () => {
        const CABINET_SIZE = 'Mini-ATX'
        const CABINET_GENERIC_PWS = true
        const product: Product = {
            description: 'product-description',
            id_brand: 1,
            id_category: 1,
            image: null,
            name: 'cabinet-created',
            price: 100,
            stock: true,
        }
        const cabinet: ICabinetProductless = {
            generic_pws: CABINET_GENERIC_PWS,
            size: CABINET_SIZE
        }
        const response = await repository.createCabinet(product, cabinet)

        expect(response).toBeInstanceOf(Cabinet)
        expect(response.id).toBe(4)
        expect(response.size).toBe(CABINET_SIZE)
        expect(response.generic_pws).toBe(CABINET_GENERIC_PWS)
    });
});

describe('modifyCabinet', () => {
    it('should modify cabinet by id', async () => {
        const CABINET_ID = 1
        const CABINET_EDITED: ICabinetEdit = { generic_pws: false }
        const response = await repository.modifyCabinet(CABINET_ID, CABINET_EDITED)
        expect(response.id).toBe(CABINET_ID)
        expect(response.generic_pws).toBe(CABINET_EDITED.generic_pws)
    });
    it('should throw if cabinet does not exist', async () => {
        const INEXISTENT_ID = 555
        const CABINET_EDITED: ICabinetEdit = { generic_pws: false }
        expect.assertions(1)
        try {
            await repository.modifyCabinet(INEXISTENT_ID, CABINET_EDITED)
        } catch (err) {
            expect(err).toEqual(CabinetError.notFound())
        }
    });
});

describe('deleteCabinet', () => {
    it('should delete cabinet by id', async () => {
        const VALID_ID = 1
        const response = await repository.deleteCabinet(VALID_ID)
        expect(response).toBe(true)
    });
    it('should throw if cabinet was not found', async () => {
        const INEXSISTENT_ID = 155555
        expect.assertions(1)
        try {
            await repository.deleteCabinet(INEXSISTENT_ID)
        } catch (err) {
            expect(err).toEqual(CabinetError.notFound())
        }
    });
});