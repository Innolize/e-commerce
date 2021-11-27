import 'reflect-metadata'
import { IBrandRepository } from '../../../brand/interfaces/IBrandRepository';
import { ICategoryRepository } from '../../../category/interfaces/ICategoryRepository';
import { GetProductsReqDto } from '../../dto/getProductsReqDto';
import { Product } from '../../entity/Product';
import { IProductEdit } from '../../interfaces/IProductEdit';
import { IProductRepository } from '../../interfaces/IProductRepository';
import { ProductService } from '../productService';

let productService: ProductService
const productRepository: IProductRepository = {
    createProduct: jest.fn(),
    deleteProduct: jest.fn(),
    getAllProduct: jest.fn(),
    getById: jest.fn(),
    modifyProduct: jest.fn()
}
const brandRepository: IBrandRepository = {
    createBrand: jest.fn(),
    deleteBrand: jest.fn(),
    getAllBrands: jest.fn(),
    getById: jest.fn(),
    modifyBrand: jest.fn()
}

const categoryRepository: ICategoryRepository = {
    createCategory: jest.fn(),
    deleteCategory: jest.fn(),
    findCategoryById: jest.fn(),
    getAllCategories: jest.fn(),
    modifyCategory: jest.fn()
}

beforeEach(() => {
    productService = new ProductService(productRepository, brandRepository, categoryRepository)
});

afterEach(() => {
    jest.clearAllMocks()
});

const sampleProduct = new Product(
    "new-product",
    null,
    "new-product-description",
    1,
    true,
    1,
    1,
)

describe('deleteProduct', () => {
    it('should call productRepository.deleteProduct once', async () => {
        const ID = 15
        await productService.deleteProduct(ID)
        expect(productRepository.deleteProduct).toHaveBeenCalledTimes(1)
        expect(productRepository.deleteProduct).toHaveBeenCalledWith(ID)
    });
});

describe('getAllProducts', () => {
    it('should call productRepository.getAllProduct once', async () => {
        const GetAllOptions = new GetProductsReqDto()
        await productService.getAllProducts(GetAllOptions)
        expect(productRepository.getAllProduct).toHaveBeenCalledTimes(1)
        expect(productRepository.getAllProduct).toHaveBeenCalledWith(GetAllOptions)
    });
});

describe('modifyProduct', () => {
    it('should call productRepository.modifyProduct once', async () => {
        const ID = 1
        const newProductProps: IProductEdit = { name: "new-name" }
        await productService.modifyProduct(ID, newProductProps)
        expect(productRepository.modifyProduct).toHaveBeenCalledTimes(1)
        expect(productRepository.modifyProduct).toHaveBeenCalledWith(ID, newProductProps)
    });
});

describe('createProduct', () => {
    it('should call productRepository.createProduct once', async () => {
        await productService.createProduct(sampleProduct)
        expect(productRepository.createProduct).toHaveBeenCalledTimes(1)
        expect(productRepository.createProduct).toHaveBeenCalledWith(sampleProduct)
    });
});

describe('findProductById', () => {
    it('should call productRepository.findProductById once', async () => {
        const ID = 1
        await productService.findProductById(ID)
        expect(productRepository.getById).toHaveBeenCalledTimes(1)
        expect(productRepository.getById).toHaveBeenCalledWith(ID)
    });
});

describe('verifyCategoryAndBrandExistence', () => {
    it('should call categoryRepository.findCategoryById and brandRepository.getById once', async () => {
        const BRAND_ID = 1
        const CATEGORY_ID = 5
        await productService.verifyCategoryAndBrandExistence(CATEGORY_ID, BRAND_ID)
        expect(categoryRepository.findCategoryById).toHaveBeenCalledTimes(1)
        expect(categoryRepository.findCategoryById).toHaveBeenCalledWith(CATEGORY_ID)
        expect(brandRepository.getById).toHaveBeenCalledTimes(1)
        expect(brandRepository.getById).toHaveBeenCalledWith(BRAND_ID)
    });
});