import { Container } from "inversify"
import { Sequelize } from "sequelize"
import { TYPES } from './inversify.types'
import multer, { memoryStorage, Multer } from 'multer'
import { ProductController, ProductRepository, ProductService, ProductModel } from '../module/product/module'
import { CategoryController, CategoryRepository, CategoryService, CategoryModel } from '../module/category/module'
import { BrandController, BrandModel, BrandRepository, BrandService } from '../module/brand/module'
// import path from 'path'


function configureUploadMiddleware() {
    const storage = memoryStorage()
    // multer.diskStorage({
    //     destination: function (req, file, cb) {
    //         cb(null, <string>process.env.PRODUCT_IMAGE_FOLDER)
    //     },
    //     filename: function (req, file, cb) {
    //         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    //     }
    // })

    return multer({ storage })
}

function configureDatabase() {
    return new Sequelize(<string>process.env.DATABASE_URL, {
        logging: false,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,

    })
}

export function configProductModel(container: Container): typeof ProductModel {
    ProductModel.setup(container.get(TYPES.Common.Database))
    ProductModel.setupCategoryAssociation(container.get(TYPES.Category.Model))
    return ProductModel
}

export function configCategoryModel(container: Container): typeof CategoryModel {
    CategoryModel.setup(container.get(TYPES.Common.Database))
    return CategoryModel
}

export function configBrandModel(container: Container): typeof BrandModel {
    BrandModel.setup(container.get(TYPES.Common.Database))
    return BrandModel
}

function configureProductContainer(container: Container): void {
    container.bind<typeof ProductModel>(TYPES.Product.Model).toConstantValue(configProductModel(container));
    container.bind<ProductRepository>(TYPES.Product.Repository).to(ProductRepository)
    container.bind<ProductService>(TYPES.Product.Service).to(ProductService)
    container.bind<ProductController>(TYPES.Product.Controller).to(ProductController)
}

function configureCommonContainer(container: Container): void {
    container.bind<Sequelize>(TYPES.Common.Database).toConstantValue(configureDatabase());
    container.bind<Multer>(TYPES.Common.UploadMiddleware).toConstantValue(configureUploadMiddleware());
}

function configureCategoryContainer(container: Container): void {
    container.bind<typeof CategoryModel>(TYPES.Category.Model).toConstantValue(configCategoryModel(container))
    container.bind<CategoryRepository>(TYPES.Category.Repository).to(CategoryRepository)
    container.bind<CategoryService>(TYPES.Category.Service).to(CategoryService)
    container.bind<CategoryController>(TYPES.Category.Controller).to(CategoryController)
}

function configureBrandContainer(container: Container): void {
    container.bind<typeof BrandModel>(TYPES.Brand.Model).toConstantValue(configBrandModel(container))
    container.bind<BrandRepository>(TYPES.Brand.Repository).to(BrandRepository)
    container.bind<BrandService>(TYPES.Brand.Service).to(BrandService)
    container.bind<BrandController>(TYPES.Brand.Controller).to(BrandController)
}

function configureDIC() {
    const dependencyContainer = new Container()
    configureCommonContainer(dependencyContainer)
    configureCategoryContainer(dependencyContainer)
    configureProductContainer(dependencyContainer)
    configureBrandContainer(dependencyContainer)
    return dependencyContainer
}

const container = configureDIC()

export default container





