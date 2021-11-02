import 'reflect-metadata'
import { Product } from '../../../../product/entity/Product';
import { IDiskStorage_Product } from '../../interface/IDiskStorageCreate';
import { IDiskStorageEdit } from '../../interface/IDiskStorageEdit';
import { IDiskStorageRepository } from "../../interface/IDiskStorageRepository";
import { DiskStorageService } from "../DiskStorageService";

const diskStorageRepository: IDiskStorageRepository = {
    createDisk: jest.fn(),
    deleteDisk: jest.fn(),
    getDisks: jest.fn(),
    getSingleDisk: jest.fn(),
    modifyDisk: jest.fn()
}

let service: DiskStorageService

beforeEach(() => {
    service = new DiskStorageService(diskStorageRepository)
});

afterEach(() => {
    jest.clearAllMocks()
});

describe('getDisks', () => {
    it('should call repository.getDisks once', async () => {
        const TEST_QUERY = { limit: 10, offset: 0 }
        await service.getDisks(TEST_QUERY)
        expect(diskStorageRepository.getDisks).toHaveBeenCalledTimes(1)
        expect(diskStorageRepository.getDisks).toHaveBeenCalledWith(TEST_QUERY)
    });
});

describe('getSingleDisk', () => {
    it('should call repository.getSingleDisk once', async () => {
        const DISK_ID = 1
        await service.getSingleDisk(DISK_ID)
        expect(diskStorageRepository.getSingleDisk).toHaveBeenCalledTimes(1)
        expect(diskStorageRepository.getSingleDisk).toHaveBeenCalledWith(DISK_ID)
    });
});

describe('createDisk', () => {
    it('should call repository.createDisk once', async () => {
        const product: Product = { description: 'product-description', id_brand: 1, id_category: 1, image: null, name: 'test-name', price: 100, stock: true }
        const disk: IDiskStorage_Product = { mbs: 300, total_storage: 100, type: 'HDD', watts: 500, product }
        await service.createDisk(disk)
        expect(diskStorageRepository.createDisk).toHaveBeenCalledTimes(1)
        expect(diskStorageRepository.createDisk).toHaveBeenCalledWith(disk)
    });
});

describe('modifyDisk', () => {
    it('should call repository.modifyDisk once', async () => {
        const ID = 5
        const disk: IDiskStorageEdit = { watts: 20 }
        await service.modifyDisk(ID, disk)
        expect(diskStorageRepository.modifyDisk).toHaveBeenCalledTimes(1)
        expect(diskStorageRepository.modifyDisk).toHaveBeenCalledWith(ID, disk)
    });

});

describe('deleteCabinet', () => {
    it('should call repository.deleteCabinet once ', async () => {
        const ID = 5
        await service.deleteDisk(ID)
        expect(diskStorageRepository.deleteDisk).toHaveBeenCalledTimes(1)
        expect(diskStorageRepository.deleteDisk).toHaveBeenCalledWith(ID)
    });
});