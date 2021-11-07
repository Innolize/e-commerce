import 'reflect-metadata'
import { Product } from '../../../../product/entity/Product';
import { IPowerSupplyCreate } from '../../interface/IPowerSupplyCreate';
import { IPowerSupplyEdit } from '../../interface/IPowerSupplyEdit';
import { IPowerSupplyRepository } from '../../interface/IPowerSupplyRepository';
import { PowerSupplyService } from '../PowerSupplyService';


const powerSupplyRepository: IPowerSupplyRepository = {
    create: jest.fn(),
    delete: jest.fn(),
    getAll: jest.fn(),
    getSingle: jest.fn(),
    modify: jest.fn()
}

let service: PowerSupplyService

beforeEach(() => {
    service = new PowerSupplyService(powerSupplyRepository)
});

afterEach(() => {
    jest.clearAllMocks()
});

describe('getAll', () => {
    it('should call repository.getAll once', async () => {
        const TEST_QUERY = { limit: 10, offset: 0 }
        await service.getAll(TEST_QUERY)
        expect(powerSupplyRepository.getAll).toHaveBeenCalledTimes(1)
        expect(powerSupplyRepository.getAll).toHaveBeenCalledWith(TEST_QUERY)
    });
});

describe('getSingle', () => {
    it('should call repository.getSingle once', async () => {
        const POWER_SUPPLY_ID = 1
        await service.getSingle(POWER_SUPPLY_ID)
        expect(powerSupplyRepository.getSingle).toHaveBeenCalledTimes(1)
        expect(powerSupplyRepository.getSingle).toHaveBeenCalledWith(POWER_SUPPLY_ID)
    });
});

describe('create', () => {
    it('should call repository.create once', async () => {
        const product: Product = { description: 'product-description', id_brand: 1, id_category: 1, image: null, name: 'product-name', price: 500, stock: true }
        const powerSupply: IPowerSupplyCreate = { certification: 'GENERIC', watts: 100, product }
        await service.create(powerSupply)
        expect(powerSupplyRepository.create).toHaveBeenCalledTimes(1)
        expect(powerSupplyRepository.create).toHaveBeenCalledWith(powerSupply)
    });
});

describe('modify', () => {
    it('should call repository.modify once', async () => {
        const ID = 5
        const powerSupply: IPowerSupplyEdit = { watts: 20 }
        await service.modify(ID, powerSupply)
        expect(powerSupplyRepository.modify).toHaveBeenCalledTimes(1)
        expect(powerSupplyRepository.modify).toHaveBeenCalledWith(ID, powerSupply)
    });

});

describe('delete', () => {
    it('should call repository.delete once ', async () => {
        const ID = 5
        await service.delete(ID)
        expect(powerSupplyRepository.delete).toHaveBeenCalledTimes(1)
        expect(powerSupplyRepository.delete).toHaveBeenCalledWith(ID)
    });
});