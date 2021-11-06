import 'reflect-metadata'
import { Product } from '../../../../product/entity/Product'
import { IMotherboardCreate } from '../../interface/IMotherboardCreate'
import { IMotherboardEdit } from '../../interface/IMotherboardEdit'
import { IMotherboardRepository } from '../../interface/IMotherboardRepository'
import { MotherboardService } from '../motherboardService'

const motherboardRepository: IMotherboardRepository = {
    create: jest.fn(),
    delete: jest.fn(),
    getAll: jest.fn(),
    getSingle: jest.fn(),
    modify: jest.fn()
}

let service: MotherboardService

beforeEach(() => {
    service = new MotherboardService(motherboardRepository)
});

afterEach(() => {
    jest.clearAllMocks()
});

describe('getAll', () => {
    it('should call repository.getAll once', async () => {
        const TEST_QUERY = { limit: 10, offset: 0 }
        await service.getAll(TEST_QUERY)
        expect(motherboardRepository.getAll).toHaveBeenCalledTimes(1)
        expect(motherboardRepository.getAll).toHaveBeenCalledWith(TEST_QUERY)
    });
});

describe('getSingle', () => {
    it('should call repository.getSingle once', async () => {
        const MOTHERBOARD_ID = 1
        await service.getSingle(MOTHERBOARD_ID)
        expect(motherboardRepository.getSingle).toHaveBeenCalledTimes(1)
        expect(motherboardRepository.getSingle).toHaveBeenCalledWith(MOTHERBOARD_ID)
    });
});

describe('create', () => {
    it('should call repository.create once', async () => {
        const product: Product = { description: 'product-description', id_brand: 1, id_category: 1, image: null, name: 'product-name', price: 500, stock: true }
        const motherboard: IMotherboardCreate = { cpu_brand: 'AMD', min_frec: 1000, watts: 500, video_socket: 'DDR4', cpu_socket: 'ax1', max_frec: 2000, ram_version: 'DDR1', model_size: 'ATX', product }
        await service.create(motherboard)
        expect(motherboardRepository.create).toHaveBeenCalledTimes(1)
        expect(motherboardRepository.create).toHaveBeenCalledWith(motherboard)
    });
});

describe('modify', () => {
    it('should call repository.modify once', async () => {
        const ID = 5
        const motherboard: IMotherboardEdit = { watts: 20 }
        await service.modify(ID, motherboard)
        expect(motherboardRepository.modify).toHaveBeenCalledTimes(1)
        expect(motherboardRepository.modify).toHaveBeenCalledWith(ID, motherboard)
    });

});

describe('delete', () => {
    it('should call repository.delete once ', async () => {
        const ID = 5
        await service.delete(ID)
        expect(motherboardRepository.delete).toHaveBeenCalledTimes(1)
        expect(motherboardRepository.delete).toHaveBeenCalledWith(ID)
    });
});