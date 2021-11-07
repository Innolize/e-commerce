import 'reflect-metadata'
import dotenv from 'dotenv'
dotenv.config()

import { Sequelize } from 'sequelize'
import { ProductModel } from '../../../../product/module'
import { BrandModel } from '../../../../brand/module'
import { CategoryModel } from '../../../../category/module'
import { VideoCardModel } from '../../module'
import { CartItemModel } from '../../../../cart/module'
import { VideoCardRepository } from '../VideoCardRepository'
import { Product } from '../../../../product/entity/Product'
import { VideoCard } from '../../entities/VideoCard'
import { GetVideoCardReqDto } from '../../dto/getVideoCardReqDto'
import { VideoCardError } from '../../error/VideoCardError'
import { IVideoCard_Product } from '../../interface/IVideoCardCreate'
import { IVideoCardEdit } from '../../interface/IVideoCardEdit'

let sequelizeInstance: Sequelize
let videoCardModel: typeof VideoCardModel
let productModel: typeof ProductModel
let brandModel: typeof BrandModel
let categoryModel: typeof CategoryModel
let repository: VideoCardRepository

beforeAll(async (done) => {
    try {
        sequelizeInstance = new Sequelize(<string>process.env.TEST_DATABASE_URL, {
            logging: false,
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            dialect: 'postgres'
        });
        await sequelizeInstance.drop({ cascade: true })
        videoCardModel = VideoCardModel.setup(sequelizeInstance)
        productModel = ProductModel.setup(sequelizeInstance)
        brandModel = BrandModel.setup(sequelizeInstance)
        categoryModel = CategoryModel.setup(sequelizeInstance)
        CartItemModel.setup(sequelizeInstance)

        productModel.setupCategoryAssociation(categoryModel)
        productModel.setupBrandAssociation(brandModel)
        productModel.setupVideoCardAssociation(videoCardModel)

        CartItemModel.setupProductAssociation(productModel)
        productModel.setupCartItemAssociation(CartItemModel)
        VideoCardModel.setupProductAssociation(productModel)
        VideoCardModel.addVideoCardHookOnDelete(productModel)
        repository = new VideoCardRepository(videoCardModel)
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
    await videoCardModel.create({ clock_speed: 2000, memory: 2000, version: 'DDR5', watts: 90, product: product1 }, { include: VideoCardModel.associations.product })
    await videoCardModel.create({ clock_speed: 3000, memory: 4000, version: 'DDR6', watts: 70, product: product2 }, { include: VideoCardModel.associations.product })
    await videoCardModel.create({ clock_speed: 4000, memory: 8000, version: 'DDR4', watts: 70, product: product3 }, { include: VideoCardModel.associations.product })
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
        expect(response.results[0]).toBeInstanceOf(VideoCard)
    });
    it('should get power supplies with 100 watts', async () => {
        const QUERY: GetVideoCardReqDto = { limit: 10, offset: 0, version: 'DDR5' }
        const response = await repository.getAll(QUERY)
        expect(response.count).toBe(1)
        expect(response.results.length).toBe(1)
        expect(response.results[0]).toBeInstanceOf(VideoCard)
    });
});

describe('getSingle', () => {
    it('should retrieve video card with given id', async () => {
        const VIDEO_CARD_ID = 2
        const response = await repository.getSingle(VIDEO_CARD_ID)
        expect(response.id).toBe(VIDEO_CARD_ID)
        expect(response).toBeInstanceOf(VideoCard)
    });
    it('should throw if video card was not found', async () => {
        const INVALID_VIDEO_CARD_ID = 555
        expect.assertions(1)
        try {
            await repository.getSingle(INVALID_VIDEO_CARD_ID)
        } catch (err) {
            expect(err).toEqual(VideoCardError.notFound())
        }
    });
});

describe('create', () => {
    it('should create a new video card ', async () => {
        const product1 = new Product('product-name-1', null, 'product-description-1', 100, true, 1, 1)
        const videoCard: IVideoCard_Product = { version: 'DDR5', memory: 4000, clock_speed: 2000, product: product1, watts: 100 }
        const videoCardCreated = await repository.create(videoCard)
        const videoCardId = videoCardCreated.id as number
        const foundVideoCard = await videoCardModel.findByPk(videoCardId)
        expect(foundVideoCard?.watts).toBe(videoCard.watts)
        expect(foundVideoCard?.clock_speed).toBe(videoCard.clock_speed)
        const productCreatedId = videoCardCreated.product?.id
        const foundProductCreated = await productModel.findByPk(productCreatedId)
        expect(foundProductCreated?.name).toBe(product1.name)
        expect(foundProductCreated?.image).toBe(product1.image)
    });

});

describe('modify', () => {
    const videoCard: IVideoCardEdit = { watts: 500 }
    it('should modify video card correctly', async () => {
        const POWER_SUPPLY_ID = 3
        const response = await repository.modify(POWER_SUPPLY_ID, videoCard)
        expect(response.id).toBe(3)
        expect(response.watts).toBe(videoCard.watts)
    });

    it('should throw if motherboard is not found', async () => {
        const POWER_SUPPLY_ID = 62323
        expect.assertions(1)
        try {
            await repository.modify(POWER_SUPPLY_ID, videoCard)
        } catch (err) {
            expect(err).toEqual(VideoCardError.notFound())
        }
    })
});

describe('delete', () => {
    it('should delete video card if product is deleted', async () => {
        expect.assertions(1)
        const POWER_SUPPLY_ID = 1
        const product = await productModel.findByPk(1)
        await product?.destroy()
        try {
            await repository.getSingle(POWER_SUPPLY_ID)
        } catch (err) {
            expect(err).toEqual(VideoCardError.notFound())
        }
    });

    it('should throw if video card is not found', async () => {
        expect.assertions(1)
        const POWER_SUPPLY_ID = 62323
        try {
            await repository.delete(POWER_SUPPLY_ID)
        } catch (err) {
            expect(err).toEqual(VideoCardError.notFound())
        }
    })

    it('should delete video card successfully', async () => {
        const response = await repository.delete(1)
        expect(response).toStrictEqual(true)
    });
});