import "reflect-metadata";
import dotenv from 'dotenv'
dotenv.config()
import { ProductRepository } from "../productRepository"
import { Sequelize } from 'sequelize'
import { ProductModel } from "../../model/productModel"
import { Product } from "../../entity/Product"
import { CategoryModel } from "../../../category/module";
import { BrandModel } from "../../../brand/module";
import { Brand } from "../../../brand/entity/Brand";
import { Category } from "../../../category/entity/Category";
import { ProductError } from "../../error/ProductError";
import { CartItemModel } from "../../../cart/module";
import { IProductEdit } from "../../interfaces/IProductEdit";
import { GetProductsReqDto } from "../../dto/getProductsReqDto";

let sequelizeInstance: Sequelize

let brand: typeof BrandModel
let category: typeof CategoryModel
let product: typeof ProductModel
let cartItem: typeof CartItemModel

let repository: ProductRepository

beforeAll(async (done) => {
    sequelizeInstance = new Sequelize(<string>process.env.TEST_DATABASE_URL, {
        logging: false,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        dialect: 'postgres'
    });
    await sequelizeInstance.drop({ cascade: true })
    brand = BrandModel.setup(sequelizeInstance)
    category = CategoryModel.setup(sequelizeInstance)
    product = ProductModel.setup(sequelizeInstance)
    cartItem = CartItemModel.setup(sequelizeInstance)
    product.setupCategoryAssociation(category)
    product.setupBrandAssociation(brand)
    product.setupCartItemAssociation(cartItem)
    repository = new ProductRepository(product)
    await sequelizeInstance.sync({ force: true });
    done();
});

beforeEach(async (done) => {
    repository = new ProductRepository(product);
    await sequelizeInstance.sync({ force: true });
    done();
})

afterAll(async (done) => {
    await sequelizeInstance.drop({ cascade: true });
    await sequelizeInstance.close();
    done();
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

const sampleBrand = new Brand(
    "test-brand",
    "test-brand-logo"
)

const sampleCategory = new Category(
    "test-category"
)

describe('createProduct', () => {
    test('Creates a product with id 1', async () => {
        await brand.create(sampleBrand)
        await category.create(sampleCategory)
        const newProduct = await repository.createProduct(sampleProduct)

        expect(newProduct.id).toBe(1)
    })
});


describe('Get a product by id', () => {
    it("get product with correct id", async () => {
        await brand.create(sampleBrand)
        await category.create(sampleCategory)
        await repository.createProduct(sampleProduct)

        const result = await repository.getById(1)
        expect(result).toBeInstanceOf(Product)
        expect(result.id).toEqual(1)
    })
    it("returns error if product was not found", async () => {
        expect.assertions(1)
        try {
            await repository.getById(123)
        } catch (error) {
            expect(error).toBeInstanceOf(ProductError)
        }
    })

})

describe('Delete a product', () => {
    it("should delete a product by id", async () => {
        await brand.create(sampleBrand)
        await category.create(sampleCategory)
        await repository.createProduct(sampleProduct)
        const response = await repository.deleteProduct(1)
        expect(response).toBe(true)
    })
    it("should throw when trying to delete an inexistent product", async () => {
        await expect(repository.deleteProduct(123)).rejects.toThrowError()
    })
})

describe("modifyProduct", () => {
    it("modify a product by id", async () => {
        await brand.create(sampleBrand)
        await category.create(sampleCategory)
        await repository.createProduct(sampleProduct)
        const newProductProperties: IProductEdit = { name: "test" }
        const modifiedProduct = await repository.modifyProduct(1, newProductProperties)
        expect(modifiedProduct.name).toBe("test")
    })

    it("modify a product by id returns error when using invalid id_category", async () => {
        await brand.create(sampleBrand)
        await category.create(sampleCategory)
        await repository.createProduct(sampleProduct)

        await expect(repository.modifyProduct(1, { id: 1, name: "test", id_category: 15 })).rejects.toThrow()
    })

    it("should throw if no products were edited with given id", async () => {
        expect.assertions(1)
        const INEXISTENT_PRODUCT_ID = 555
        const PRODUCT_TO_EDIT: IProductEdit = { ...sampleProduct, name: "test" }
        try {
            await repository.modifyProduct(INEXISTENT_PRODUCT_ID, PRODUCT_TO_EDIT)
        } catch (err) {
            expect(err).toBeInstanceOf(ProductError)
        }
    })
})

describe("getAllProduct", () => {
    it("Return all products", async () => {
        await brand.create(sampleBrand)
        await category.create(sampleCategory)
        await product.create(sampleProduct)
        const productQuery = new GetProductsReqDto()
        const productList = await repository.getAllProduct(productQuery)
        expect(productList.results).toHaveLength(1)
        expect(productList.results[0]).toBeInstanceOf(Product)
    })
    it('should retrieve products that have "test" in their name', async () => {
        const SAMPLE_PRODUCT_2: Product = { ...sampleProduct, name: 'test1' }
        const SAMPLE_PRODUCT_3: Product = { ...sampleProduct, name: 'test2' }
        await brand.create(sampleBrand)
        await category.create(sampleCategory)
        await product.create(sampleProduct)
        await product.create(SAMPLE_PRODUCT_2)
        await product.create(SAMPLE_PRODUCT_3)
        const productQuery = new GetProductsReqDto(5, 0, 'test')
        const response = await repository.getAllProduct(productQuery)
        expect(response.results).toHaveLength(2)
        expect(response.count).toBe(2)
    });

    it('should retrieve products that have 1 as id_category', async () => {
        const SAMPLE_CATEGORY_2: Category = { name: 'test-category-2' }
        const SAMPLE_PRODUCT_2: Product = { ...sampleProduct, id_category: 2 }
        await brand.create(sampleBrand)
        await category.create(sampleCategory)
        await category.create(SAMPLE_CATEGORY_2)
        await product.create(sampleProduct)
        await product.create(SAMPLE_PRODUCT_2)
        const productQuery = new GetProductsReqDto(5, 0, undefined, 2)
        const response = await repository.getAllProduct(productQuery)
        expect(response.count).toBe(1)
        expect(response.results).toHaveLength(1)
    });

    it("Return an empty array if there is no products in the database", async () => {
        const productQuery = new GetProductsReqDto()
        const productList = await repository.getAllProduct(productQuery)
        expect(productList.count).toBe(0)
        expect(productList.results).toHaveLength(0)
    })
})