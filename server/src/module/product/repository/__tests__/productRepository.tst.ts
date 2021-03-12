import "reflect-metadata";
import { ProductRepository } from "../productRepository"
import { Sequelize } from 'sequelize'
import { ProductModel } from "../../model/productModel"
import { Product } from "../../entity/Product"
import { CategoryModel } from "../../../category/module";
import { BrandModel } from "../../../brand/module";
import { Brand } from "../../../brand/entity/Category";
import { Category } from "../../../category/entity/Category";

const sequelizeInstance = new Sequelize('sqlite::memory:')
let repository: ProductRepository
let brand: typeof BrandModel
let category: typeof CategoryModel
let product: typeof ProductModel

beforeEach(() => {

    category = CategoryModel.setup(sequelizeInstance)
    brand = BrandModel.setup(sequelizeInstance)
    product = ProductModel.setup(sequelizeInstance)
    product.setupBrandAssociation(brand)
    product.setupCategoryAssociation(category)

    repository = new ProductRepository(product)
})

beforeEach(async (done) => {
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

test('Creates a product with id 1', async () => {  
    const productMock = {} as Product
    expect(repository.createProduct(productMock)).rejects.toThrowError(Error)
})