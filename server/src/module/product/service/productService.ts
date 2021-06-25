import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractService } from "../../abstractClasses/abstractService";
import { Brand } from "../../brand/entity/Brand";
import { BrandService } from "../../brand/module";
import { Category } from "../../category/entity/Category";
import { CategoryService } from "../../category/module";
import { Product } from "../entity/Product";
import { IProductCreate } from "../interfaces/IProductCreate";
import { IProductEdit } from "../interfaces/IProductEdit";
import { ProductRepository } from "../repository/productRepository";
import { GetProductsDto } from "../dto/getProductsDto";
import { GetProductsReqDto } from "../dto/getProductsReqDto";

@injectable()
export class ProductService extends AbstractService {
    private productRepository: ProductRepository
    private brandService: BrandService
    private categoryService: CategoryService
    constructor(
        @inject(TYPES.Product.Repository) productRepository: ProductRepository,
        @inject(TYPES.Brand.Service) brandService: BrandService,
        @inject(TYPES.Category.Service) categoryService: CategoryService
    ) {
        super()
        this.productRepository = productRepository
        this.brandService = brandService
        this.categoryService = categoryService
    }
    async deleteProduct(id: number): Promise<boolean | Error> {
        return await this.productRepository.deleteProduct(id)
    }

    async getAllProducts(queryParams: GetProductsReqDto): Promise<Error | GetProductsDto> {
        return await this.productRepository.getAllProduct(queryParams)
    }

    async modifyProduct(id: number, product: IProductEdit): Promise<Product | Error> {
        return await this.productRepository.modifyProduct(id, product)
    }

    async createProduct(product: IProductCreate): Promise<Product | Error> {
        return await this.productRepository.createProduct(product)
    }
    async findProductById(id: number): Promise<Error | Product> {
        return await this.productRepository.getById(id)
    }
    async verifyCategoryAndBrandExistence(categoryId: number, brandId: number): Promise<{ category: Category, brand: Brand }> {
        const category = await this.categoryService.findCategoryById(categoryId)
        const brand = await this.brandService.findBrandById(brandId)
        return { category, brand }
    }
}