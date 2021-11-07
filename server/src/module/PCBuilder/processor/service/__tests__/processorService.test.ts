import 'reflect-metadata'
import { Product } from '../../../../product/entity/Product';
import { IProcessorCreate } from '../../interface/IProcessorCreate';
import { IProcessorEdit } from '../../interface/IProcessorEdit';
import { IProcessorRepository } from "../../interface/IProcessorRepository";
import { ProcessorService } from "../ProcessorService";

const processorRepository: IProcessorRepository = {
    create: jest.fn(),
    delete: jest.fn(),
    getAll: jest.fn(),
    getSingle: jest.fn(),
    modify: jest.fn()
}

let service: ProcessorService

beforeEach(() => {
    service = new ProcessorService(processorRepository)
});

afterEach(() => {
    jest.clearAllMocks()
});

describe('getAll', () => {
    it('should call repository.getAll once', async () => {
        const TEST_QUERY = { limit: 10, offset: 0 }
        await service.getAll(TEST_QUERY)
        expect(processorRepository.getAll).toHaveBeenCalledTimes(1)
        expect(processorRepository.getAll).toHaveBeenCalledWith(TEST_QUERY)
    });
});

describe('getSingle', () => {
    it('should call repository.getSingle once', async () => {
        const PROCESSOR_ID = 1
        await service.getSingle(PROCESSOR_ID)
        expect(processorRepository.getSingle).toHaveBeenCalledTimes(1)
        expect(processorRepository.getSingle).toHaveBeenCalledWith(PROCESSOR_ID)
    });
});

describe('create', () => {
    it('should call repository.create once', async () => {
        const product: Product = { description: 'product-description', id_brand: 1, id_category: 1, image: null, name: 'product-name', price: 500, stock: true }
        const processor: IProcessorCreate = { socket: 'ax1', cores: 3, frecuency: 1400, watts: 80, product }
        await service.create(processor)
        expect(processorRepository.create).toHaveBeenCalledTimes(1)
        expect(processorRepository.create).toHaveBeenCalledWith(processor)
    });
});

describe('modify', () => {
    it('should call repository.modify once', async () => {
        const ID = 5
        const processor: IProcessorEdit = { watts: 20 }
        await service.modify(ID, processor)
        expect(processorRepository.modify).toHaveBeenCalledTimes(1)
        expect(processorRepository.modify).toHaveBeenCalledWith(ID, processor)
    });

});

describe('delete', () => {
    it('should call repository.delete once ', async () => {
        const ID = 5
        await service.delete(ID)
        expect(processorRepository.delete).toHaveBeenCalledTimes(1)
        expect(processorRepository.delete).toHaveBeenCalledWith(ID)
    });
});