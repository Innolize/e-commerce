import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractService } from "../../abstractClasses/abstractService";
import { Brand } from "../../brand/entity/Brand";
import { Category } from "../../category/entity/Category";
import { Product } from "../entity/Product";
import { IProductCreate } from "../interfaces/IProductCreate";
import { IProductEdit } from "../interfaces/IProductEdit";
import { GetProductsDto } from "../dto/getProductsDto";
import { GetProductsReqDto } from "../dto/getProductsReqDto";
import { IProductRepository } from "../interfaces/IProductRepository";
import { IProductService } from "../interfaces/IProductService";
import { IBrandRepository } from "../../brand/interfaces/IBrandRepository";
import { ICategoryRepository } from "../../category/interfaces/ICategoryRepository";

@injectable()
export class ProductService extends AbstractService implements IProductService {
    constructor(
        @inject(TYPES.Product.Repository) private productRepository: IProductRepository,
        @inject(TYPES.Brand.Repository) private brandRepository: IBrandRepository,
        @inject(TYPES.Category.Service) private categoryRepository: ICategoryRepository
    ) {
        super()
        this.productRepository = productRepository
        this.brandRepository = brandRepository
        this.categoryRepository = categoryRepository
    }
    async deleteProduct(id: number): Promise<boolean> {
        return await this.productRepository.deleteProduct(id)
    }

    async getAllProducts(queryParams: GetProductsReqDto): Promise<GetProductsDto> {
        return await this.productRepository.getAllProduct(queryParams)
    }

    async modifyProduct(id: number, product: IProductEdit): Promise<Product> {
        return await this.productRepository.modifyProduct(id, product)
    }

    async createProduct(product: IProductCreate): Promise<Product> {
        return await this.productRepository.createProduct(product)
    }
    async findProductById(id: number): Promise<Product> {
        return await this.productRepository.getById(id)
    }
    async verifyCategoryAndBrandExistence(categoryId: number, brandId: number): Promise<{ category: Category, brand: Brand }> {
        const category = await this.categoryRepository.findCategoryById(categoryId)
        const brand = await this.brandRepository.getById(brandId)
        return { category, brand }
    }
}