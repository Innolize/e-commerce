import 'reflect-metadata'
import { GetBrandsDto } from "../../dto/getBrandsDto";
import { GetBrandsReqDto } from '../../dto/getBrandsReqDto';
import { Brand } from "../../entity/Brand";
import { IBrandCreate } from '../../interfaces/IBrandCreate';
import { IBrandEdit } from '../../interfaces/IBrandEdit';
import { BrandService } from "../brandService";


let service: BrandService
const brandRepository = {
    createBrand: jest.fn(),
    deleteBrand: jest.fn(),
    getAllBrands: jest.fn(),
    getById: jest.fn(),
    modifyBrand: jest.fn()
}

beforeAll(() => {
    service = new BrandService(brandRepository)
});

afterAll(() => {
    jest.clearAllMocks()
});

describe('getAllBrands', () => {
    it('should retrieve brands', async () => {
        const BRAND1 = new Brand('brand-1', null, 1)
        const BRAND2 = new Brand('brand-2', null, 2)
        const getAllMockResponse = new GetBrandsDto(2, [BRAND1, BRAND2])
        brandRepository.getAllBrands.mockImplementationOnce(() => Promise.resolve(getAllMockResponse))
        const response = await service.getAllBrands()
        expect(response.count).toBe(2)
        expect(response.results[0]).toBeInstanceOf(Brand)
    });
    it('should call repository with selected limit, offset and name', async () => {
        const LIMIT_TEST = 3
        const OFFSET_TEST = 5
        const NAME_TEST = 'test'
        const GetAllQuery = new GetBrandsReqDto(LIMIT_TEST, OFFSET_TEST, NAME_TEST)
        await service.getAllBrands(GetAllQuery)
        expect(brandRepository.getAllBrands).toHaveBeenCalledWith(GetAllQuery)
    });
});

describe('deleteBrand', () => {
    it('should call repository.deleteBrand once', async () => {
        const BRAND_TO_DELETE_ID = 5
        await service.deleteBrand(BRAND_TO_DELETE_ID)
        expect(brandRepository.deleteBrand).toHaveBeenCalledWith(5)
    });
});

describe('modifyBrand', () => {
    it('should call repository.modifyBrand once', async () => {
        const BRAND_TO_MODIFY_ID = 3
        const NEW_BRAND_PROPERTIES: IBrandEdit = { name: 'test-name' }
        await service.modifyBrand(BRAND_TO_MODIFY_ID, NEW_BRAND_PROPERTIES)
        expect(brandRepository.modifyBrand).toHaveBeenCalledWith(BRAND_TO_MODIFY_ID, NEW_BRAND_PROPERTIES)
    });
});

describe('createBrand', () => {
    it('should call repository.createBrand once', async () => {
        const NewBrand: IBrandCreate = {
            name: 'new-brand',
            logo: null,
        }
        await service.createBrand(NewBrand)
        expect(brandRepository.createBrand).toHaveBeenLastCalledWith(NewBrand)
    });
});

describe('findBrandById', () => {
    it('should call repository.findBrandById once', async () => {
        const BRAND_ID = 125
        await service.findBrandById(BRAND_ID)
        expect(brandRepository.getById).toHaveBeenCalledWith(BRAND_ID)
    });
});