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
import { ProcessorModel, ProcessorRepository, ProcessorService, ProcessorController } from "../module/PCBuilder/processor/module"
import { VideoCardModel, VideoCardRepository, VideoCardController, VideoCardService } from "../module/PCBuilder/video-card/module"
import { CabinetModel, CabinetRepository, CabinetController, CabinetService } from "../module/PCBuilder/cabinet/module"
import { PowerSupplyController, PowerSupplyModel, PowerSupplyRepository, PowerSupplyService } from "../module/PCBuilder/power-supply/module"
import { DiskStorageController, DiskStorageModel, DiskStorageRepository, DiskStorageService } from "../module/PCBuilder/disk-storage/module"
import { UserController, UserModel, UserRepository, UserService } from '../module/user/module'
import bcrypt from 'bcrypt'
import { AuthController, AuthService } from "../module/auth/module"
import { PermissionModel, RoleModel } from "../module/authorization/module"

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

export function configProcessorModel(container: Container): typeof ProcessorModel {
    ProcessorModel.setup(container.get(TYPES.Common.Database))
    ProcessorModel.setupProductAssociation(container.get(TYPES.Product.Model))
    return ProcessorModel
}

export function configVideoCardModel(container: Container): typeof VideoCardModel {
    VideoCardModel.setup(container.get(TYPES.Common.Database))
    VideoCardModel.setupProductAssociation(container.get(TYPES.Product.Model))
    return VideoCardModel
}

export function configCabinetModel(container: Container): typeof CabinetModel {
    CabinetModel.setup(container.get(TYPES.Common.Database))
    CabinetModel.setupProductAssociation(container.get(TYPES.Product.Model))
    return CabinetModel
}

export function configPowerSupplyModel(container: Container): typeof PowerSupplyModel {
    PowerSupplyModel.setup(container.get(TYPES.Common.Database))
    PowerSupplyModel.setupProductAssociation(container.get(TYPES.Product.Model))
    return PowerSupplyModel
}

export function configDiskStorageModel(container: Container): typeof DiskStorageModel {
    DiskStorageModel.setup(container.get(TYPES.Common.Database))
    DiskStorageModel.setupProductAssociation(container.get(TYPES.Product.Model))
    return DiskStorageModel
}
export function configUserModel(container: Container): typeof UserModel {
    return UserModel.setup(container.get(TYPES.Common.Database))
}

export function configRoleModel(container: Container): typeof RoleModel {
    return RoleModel.setup(container.get(TYPES.Common.Database))
}

export function configPermissionModel(container: Container): typeof PermissionModel {
    return PermissionModel.setup(container.get(TYPES.Common.Database))
}

function configPermissionContainer(container: Container): void {
    container.bind<typeof PermissionModel>(TYPES.Authorization.Permission.Model).toConstantValue(configPermissionModel(container));
    container.bind<typeof RoleModel>(TYPES.Authorization.Role.Model).toConstantValue(configRoleModel(container))
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
    container.bind<S3>(TYPES.Common.ImageStorage).toConstantValue(configureImageDatabase());
    container.bind<typeof bcrypt>(TYPES.Common.Encryption).toConstantValue(bcrypt)
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

function configureUserContainer(container: Container): void {
    container.bind<typeof UserModel>(TYPES.User.Model).toConstantValue(configUserModel(container))
    container.bind<UserRepository>(TYPES.User.Repository).to(UserRepository)
    container.bind<UserService>(TYPES.User.Service).to(UserService)
    container.bind<UserController>(TYPES.User.Controller).to(UserController)
}

function configureAuthContainer(container: Container): void {
    container.bind<AuthService>(TYPES.Auth.Service).to(AuthService)
    container.bind<AuthController>(TYPES.Auth.Controller).to(AuthController)
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
    container.bind<typeof ProcessorModel>(TYPES.PCBuilder.Processor.Model).toConstantValue(configProcessorModel(container))
    container.bind<ProcessorRepository>(TYPES.PCBuilder.Processor.Repository).to(ProcessorRepository)
    container.bind<ProcessorService>(TYPES.PCBuilder.Processor.Service).to(ProcessorService)
    container.bind<ProcessorController>(TYPES.PCBuilder.Processor.Controller).to(ProcessorController)
    container.bind<typeof VideoCardModel>(TYPES.PCBuilder.VideoCard.Model).toConstantValue(configVideoCardModel(container))
    container.bind<VideoCardRepository>(TYPES.PCBuilder.VideoCard.Repository).to(VideoCardRepository)
    container.bind<VideoCardService>(TYPES.PCBuilder.VideoCard.Service).to(VideoCardService)
    container.bind<VideoCardController>(TYPES.PCBuilder.VideoCard.Controller).to(VideoCardController)
    container.bind<typeof CabinetModel>(TYPES.PCBuilder.Cabinet.Model).toConstantValue(configCabinetModel(container))
    container.bind<CabinetRepository>(TYPES.PCBuilder.Cabinet.Repository).to(CabinetRepository)
    container.bind<CabinetService>(TYPES.PCBuilder.Cabinet.Service).to(CabinetService)
    container.bind<CabinetController>(TYPES.PCBuilder.Cabinet.Controller).to(CabinetController)
    container.bind<typeof PowerSupplyModel>(TYPES.PCBuilder.PowerSupply.Model).toConstantValue(configPowerSupplyModel(container))
    container.bind<PowerSupplyRepository>(TYPES.PCBuilder.PowerSupply.Repository).to(PowerSupplyRepository)
    container.bind<PowerSupplyService>(TYPES.PCBuilder.PowerSupply.Service).to(PowerSupplyService)
    container.bind<PowerSupplyController>(TYPES.PCBuilder.PowerSupply.Controller).to(PowerSupplyController)
    container.bind<typeof DiskStorageModel>(TYPES.PCBuilder.DiskStorage.Model).toConstantValue(configDiskStorageModel(container))
    container.bind<DiskStorageRepository>(TYPES.PCBuilder.DiskStorage.Repository).to(DiskStorageRepository)
    container.bind<DiskStorageService>(TYPES.PCBuilder.DiskStorage.Service).to(DiskStorageService)
    container.bind<DiskStorageController>(TYPES.PCBuilder.DiskStorage.Controller).to(DiskStorageController)
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
    configureUserContainer(dependencyContainer)
    configurePCBuilder(dependencyContainer)
    configureAuthContainer(dependencyContainer)
    configPermissionContainer(dependencyContainer)
    return dependencyContainer
}

const container = configureDIC()

export default container





