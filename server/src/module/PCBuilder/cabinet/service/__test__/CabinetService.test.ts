import 'reflect-metadata'
import { Product } from '../../../../product/entity/Product';
import { ICabinetProductless } from '../../interface/ICabinetCreate';
import { ICabinetRepository } from "../../interface/ICabinetRepository";
import { CabinetService } from "../CabinetService";


const cabinetRepository: ICabinetRepository = {
    createCabinet: jest.fn(),
    deleteCabinet: jest.fn(),
    getCabinets: jest.fn(),
    getSingleCabinet: jest.fn(),
    modifyCabinet: jest.fn()
}
let service: CabinetService
beforeEach(() => {
    service = new CabinetService(cabinetRepository)
});

afterEach(() => {
    jest.clearAllMocks()
});

describe('getCabinets', () => {
    it('should call repository.getCabinets once', async () => {
        const TEST_QUERY = { limit: 10, offset: 0 }
        await service.getCabinets(TEST_QUERY)
        expect(cabinetRepository.getCabinets).toHaveBeenCalledTimes(1)
        expect(cabinetRepository.getCabinets).toHaveBeenCalledWith(TEST_QUERY)
    });
});

describe('getSingleCabinet', () => {
    it('should call repository.getSingleCabinet once', async () => {
        const CABINET_ID = 1
        await service.getSingleCabinet(CABINET_ID)
        expect(cabinetRepository.getSingleCabinet).toHaveBeenCalledTimes(1)
        expect(cabinetRepository.getSingleCabinet).toHaveBeenCalledWith(CABINET_ID)
    });
});

describe('createCabinet', () => {
    it('should call repository.createCabinet once', async () => {
        const product: Product = { description: 'product-description', id_brand: 1, id_category: 1, image: null, name: 'test-name', price: 100, stock: true }
        const cabinet: ICabinetProductless = { generic_pws: true, size: 'ATX' }
        await service.createCabinet(product, cabinet)
        expect(cabinetRepository.createCabinet).toHaveBeenCalledTimes(1)
        expect(cabinetRepository.createCabinet).toHaveBeenCalledWith(product, cabinet)
    });
});

describe('modifyCabinet', () => {
    it('should call repository.modifyCabinet once', async () => {
        const ID = 5
        const cabinet: ICabinetProductless = { generic_pws: true, size: 'ATX' }
        await service.modifyCabinet(ID, cabinet)
        expect(cabinetRepository.modifyCabinet).toHaveBeenCalledTimes(1)
        expect(cabinetRepository.modifyCabinet).toHaveBeenCalledWith(ID, cabinet)
    });

});

describe('deleteCabinet', () => {
    it('should call repository.deleteCabinet once ', async () => {
        const ID = 5
        await service.deleteCabinet(ID)
        expect(cabinetRepository.deleteCabinet).toHaveBeenCalledTimes(1)
        expect(cabinetRepository.deleteCabinet).toHaveBeenCalledWith(ID)
    });
});