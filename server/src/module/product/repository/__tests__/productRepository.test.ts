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
import { FullProduct } from "../../entity/FullProduct";

const sequelizeInstance = new Sequelize(<string>process.env.TEST_DATABASE_URL, {
    logging: false,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    dialect: 'postgres'

})

let brand: typeof BrandModel
let category: typeof CategoryModel
let product: typeof ProductModel

let repository: ProductRepository

// beforeAll(async () => {

// })

beforeEach(async (done) => {

    await sequelizeInstance.drop()

    brand = BrandModel.setup(sequelizeInstance)
    category = CategoryModel.setup(sequelizeInstance)
    product = ProductModel.setup(sequelizeInstance)
    product.setupCategoryAssociation(category)
    product.setupBrandAssociation(brand)
    repository = new ProductRepository(product)
    await sequelizeInstance.sync({ force: true });
    done();
});

const sampleProduct = new Product({
    name: "new-product",
    description: "new-product-description",
    id_brand: 1,
    id_category: 1,
    image: "image-test",
    price: 200,
    stock: true
})

const sampleBrand = new Brand({
    name: "test-brand"
})

const sampleCategory = new Category({
    name: "test-category"
})

test('Creates a product with id 1', async () => {
    await brand.create(sampleBrand)
    await category.create(sampleCategory)
    const newProduct = await repository.createProduct(sampleProduct) as Product

    expect(newProduct.id).toBe(1)
})

describe('Get a product by id', () => {
    it("get product with correct id", async () => {
        await brand.create(sampleBrand)
        await category.create(sampleCategory)
        await repository.createProduct(sampleProduct) as Product

        const result = await repository.getById(1) as FullProduct
        expect(result).toBeInstanceOf(FullProduct)
        expect(result.id).toEqual(1)
    })
    it("returns error if product was not found", async () => {
        await expect(repository.getById(123)).rejects.toThrow("product not found")
    })

})

describe('Delete a product', () => {
    it("delete a product by id", async () => {
        await brand.create(sampleBrand)
        await category.create(sampleCategory)
        await repository.createProduct(sampleProduct)

        await expect(repository.deleteProduct(1)).resolves.toBe(true)
    })
    it("throw error when trying to delete an inexistent product", async () => {
        await expect(repository.deleteProduct(123)).rejects.toThrowError()
    })
})

describe("Modify a product", () => {
    it("modify a product by id", async () => {
        await brand.create(sampleBrand)
        await category.create(sampleCategory)
        await repository.createProduct(sampleProduct) as Product
        const modifiedProduct = await repository.modifyProduct({ id: 1, name: "test" })
        expect(modifiedProduct.name).toBe("test")
    })

    it("modify a product by id returns error when using invalid id_category", async () => {
        await brand.create(sampleBrand)
        await category.create(sampleCategory)
        await repository.createProduct(sampleProduct) as Product

        await expect(repository.modifyProduct({ id: 1, name: "test", id_category: 15 })).rejects.toThrow()
    })
})

describe("Get product by name", () => {
    it("Search products with 'duct' in name", async () => {
        await brand.create(sampleBrand)
        await category.create(sampleCategory)
        await product.create(sampleProduct)
        await expect(repository.getProductsByName("duct")).resolves.toHaveLength(1)
    })
    it("Search inexistent product", async () => {
        await brand.create(sampleBrand)
        await category.create(sampleCategory)
        await product.create(sampleProduct)
        await expect(repository.getProductsByName("asdfg")).resolves.toHaveLength(0)
    })

})

describe("Return a list of products", () => {
    it("Return all products", async () => {
        await brand.create(sampleBrand)
        await category.create(sampleCategory)
        await product.create(sampleProduct)
        const productList = await repository.getAllProduct()
        expect(productList).toHaveLength(1)
    })
    it("Return an empty array if there is no products in the database", async () => {
        const productList = await repository.getAllProduct()
        expect(productList).toHaveLength(0)
    })
})