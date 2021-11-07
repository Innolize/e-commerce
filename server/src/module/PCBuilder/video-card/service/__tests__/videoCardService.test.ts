import 'reflect-metadata'
import { Product } from '../../../../product/entity/Product';
import { IVideoCardCreate } from '../../interface/IVideoCardCreate';
import { IVideoCardEdit } from '../../interface/IVideoCardEdit';
import { IVideoCardRepository } from '../../interface/IVideoCardRepository';
import { VideoCardService } from '../VideoCardService';


const videoCardRepository: IVideoCardRepository = {
    create: jest.fn(),
    delete: jest.fn(),
    getAll: jest.fn(),
    getSingle: jest.fn(),
    modify: jest.fn()
}

let service: VideoCardService

beforeEach(() => {
    service = new VideoCardService(videoCardRepository)
});

afterEach(() => {
    jest.clearAllMocks()
});

describe('getAll', () => {
    it('should call repository.getAll once', async () => {
        const TEST_QUERY = { limit: 10, offset: 0 }
        await service.getAll(TEST_QUERY)
        expect(videoCardRepository.getAll).toHaveBeenCalledTimes(1)
        expect(videoCardRepository.getAll).toHaveBeenCalledWith(TEST_QUERY)
    });
});

describe('getSingle', () => {
    it('should call repository.getSingle once', async () => {
        const POWER_SUPPLY_ID = 1
        await service.getSingle(POWER_SUPPLY_ID)
        expect(videoCardRepository.getSingle).toHaveBeenCalledTimes(1)
        expect(videoCardRepository.getSingle).toHaveBeenCalledWith(POWER_SUPPLY_ID)
    });
});

describe('create', () => {
    it('should call repository.create once', async () => {
        const product: Product = { description: 'product-description', id_brand: 1, id_category: 1, image: null, name: 'product-name', price: 500, stock: true }
        const videoCard: IVideoCardCreate = { clock_speed: 2000, memory: 4000, version: 'DDR5', watts: 90, product }
        await service.create(videoCard)
        expect(videoCardRepository.create).toHaveBeenCalledTimes(1)
        expect(videoCardRepository.create).toHaveBeenCalledWith(videoCard)
    });
});

describe('modify', () => {
    it('should call repository.modify once', async () => {
        const ID = 5
        const videoCard: IVideoCardEdit = { watts: 20 }
        await service.modify(ID, videoCard)
        expect(videoCardRepository.modify).toHaveBeenCalledTimes(1)
        expect(videoCardRepository.modify).toHaveBeenCalledWith(ID, videoCard)
    });

});

describe('delete', () => {
    it('should call repository.delete once ', async () => {
        const ID = 5
        await service.delete(ID)
        expect(videoCardRepository.delete).toHaveBeenCalledTimes(1)
        expect(videoCardRepository.delete).toHaveBeenCalledWith(ID)
    });
});