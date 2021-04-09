import { Container } from "inversify"
import { Sequelize } from "sequelize"
import { TYPES } from './inversify.types'
import multer, { memoryStorage, Multer } from 'multer'
import { ProductController, ProductRepository, ProductService, ProductModel } from '../module/product/module'
import { CategoryController, CategoryRepository, CategoryService, CategoryModel } from '../module/category/module'
import { BrandController, BrandModel, BrandRepository, BrandService } from '../module/brand/module'
import { S3 } from 'aws-sdk'
import { ImageUploadService } from "../module/imageUploader/service/imageUploaderService"
import { MotherboardController, MotherboardModel, MotherboardRepository, MotherboardService } from "../module/PCBuilder/motherboard/module"
import { RamModel } from "../module/PCBuilder/ram/model/ramModel"
import { RamService } from "../module/PCBuilder/ram/service/ramService"
import { RamRepository } from "../module/PCBuilder/ram/repository/RamRepository"
import { RamController } from "../module/PCBuilder/ram/controller/ramController"

function configureUploadMiddleware() {
    const storage = memoryStorage()
    return multer({ storage })
}

function configureDatabase() {
    return new Sequelize(<string>process.env.DATABASE_URL, {
        logging: false,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,

    })
}

function configureImageDatabase() {
    const s3 = new S3({
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET
    })
    return s3
}

export function configProductModel(container: Container): typeof ProductModel {
    ProductModel.setup(container.get(TYPES.Common.Database))
    ProductModel.setupCategoryAssociation(container.get(TYPES.Category.Model))
    ProductModel.setupBrandAssociation(container.get(TYPES.Brand.Model))
    return ProductModel
}

export function configCategoryModel(container: Container): typeof CategoryModel {
    CategoryModel.setup(container.get(TYPES.Common.Database))
    return CategoryModel
}

export function configBrandModel(container: Container): typeof BrandModel {
    return BrandModel.setup(container.get(TYPES.Common.Database))
}

export function configMotherboardModel(container: Container): typeof MotherboardModel {
    MotherboardModel.setup(container.get(TYPES.Common.Database))
    MotherboardModel.setupProductAssociation(container.get(TYPES.Product.Model))
    return MotherboardModel
}

export function configRamModel(container: Container): typeof RamModel {
    RamModel.setup(container.get(TYPES.Common.Database))
    RamModel.setupProductAssociation(container.get(TYPES.Product.Model))
    return RamModel
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
    container.bind<S3>(TYPES.Common.ImageStorage).toConstantValue(configureImageDatabase())
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

function configurePCBuilder(container: Container): void {
    container.bind<typeof MotherboardModel>(TYPES.PCBuilder.Motherboard.Model).toConstantValue(configMotherboardModel(container))
    container.bind<MotherboardRepository>(TYPES.PCBuilder.Motherboard.Repository).to(MotherboardRepository)
    container.bind<MotherboardService>(TYPES.PCBuilder.Motherboard.Service).to(MotherboardService)
    container.bind<MotherboardController>(TYPES.PCBuilder.Motherboard.Controller).to(MotherboardController)
    container.bind<typeof RamModel>(TYPES.PCBuilder.Ram.Model).toConstantValue(configRamModel(container))
    container.bind<RamRepository>(TYPES.PCBuilder.Ram.Repository).to(RamRepository)
    container.bind<RamService>(TYPES.PCBuilder.Ram.Service).to(RamService)
    container.bind<RamController>(TYPES.PCBuilder.Ram.Controller).to(RamController)
}

function configureImageUploaderContainer(container: Container): void {
    container.bind<ImageUploadService>(TYPES.ImageUploader.Service).to(ImageUploadService)
}

function configureDIC() {
    const dependencyContainer = new Container()
    configureCommonContainer(dependencyContainer)
    configureImageUploaderContainer(dependencyContainer)
    configureCategoryContainer(dependencyContainer)
    configureBrandContainer(dependencyContainer)
    configureProductContainer(dependencyContainer)
    configurePCBuilder(dependencyContainer)
    return dependencyContainer
}

const container = configureDIC()

export default container





