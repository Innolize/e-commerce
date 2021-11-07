import 'reflect-metadata'
import { Product } from '../../../../product/entity/Product';
import { IRamCreate } from '../../interface/IRamCreate';
import { IRamEdit } from '../../interface/IRamEdit';
import { IRamRepository } from '../../interface/IRamRepository';
import { RamService } from '../ramService';


const ramRepository: IRamRepository = {
    create: jest.fn(),
    delete: jest.fn(),
    getAll: jest.fn(),
    getSingle: jest.fn(),
    modify: jest.fn()
}

let service: RamService

beforeEach(() => {
    service = new RamService(ramRepository)
});

afterEach(() => {
    jest.clearAllMocks()
});

describe('getAll', () => {
    it('should call repository.getAll once', async () => {
        const TEST_QUERY = { limit: 10, offset: 0 }
        await service.getAll(TEST_QUERY)
        expect(ramRepository.getAll).toHaveBeenCalledTimes(1)
        expect(ramRepository.getAll).toHaveBeenCalledWith(TEST_QUERY)
    });
});

describe('getSingle', () => {
    it('should call repository.getSingle once', async () => {
        const POWER_SUPPLY_ID = 1
        await service.getSingle(POWER_SUPPLY_ID)
        expect(ramRepository.getSingle).toHaveBeenCalledTimes(1)
        expect(ramRepository.getSingle).toHaveBeenCalledWith(POWER_SUPPLY_ID)
    });
});

describe('create', () => {
    it('should call repository.create once', async () => {
        const product: Product = { description: 'product-description', id_brand: 1, id_category: 1, image: null, name: 'product-name', price: 500, stock: true }
        const ram: IRamCreate = { max_frec: 3000, memory: 2000, watts: 40, min_frec: 1000, ram_version: 'DDR2', product }
        await service.create(ram)
        expect(ramRepository.create).toHaveBeenCalledTimes(1)
        expect(ramRepository.create).toHaveBeenCalledWith(ram)
    });
});

describe('modify', () => {
    it('should call repository.modify once', async () => {
        const ID = 5
        const ram: IRamEdit = { watts: 20 }
        await service.modify(ID, ram)
        expect(ramRepository.modify).toHaveBeenCalledTimes(1)
        expect(ramRepository.modify).toHaveBeenCalledWith(ID, ram)
    });

});

describe('delete', () => {
    it('should call repository.delete once ', async () => {
        const ID = 5
        await service.delete(ID)
        expect(ramRepository.delete).toHaveBeenCalledTimes(1)
        expect(ramRepository.delete).toHaveBeenCalledWith(ID)
    });
});