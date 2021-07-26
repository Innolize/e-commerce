import 'reflect-metadata'
import { IProductRepository } from '../../interfaces/IProductRepository';
import { ProductService } from '../productService';
import { ProductRepository } from '../../repository/productRepository'


let service: ProductService
const repository: IProductRepository = {
    createProduct: jest.fn(),
    deleteProduct: jest.fn(),
    getAllProduct: jest.fn(),
    getById: jest.fn(),
    modifyProduct: jest.fn()

}

beforeEach(() => {
    // service = new ProductService(repository, brandRepository, categoryRepository)
});