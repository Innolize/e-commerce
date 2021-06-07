import dotenv from 'dotenv'
dotenv.config()
import "reflect-metadata";
import { Sequelize } from 'sequelize/types';
import { ProductModel } from '../../module/product/model/productModel';
import { CategoryModel } from '../../module/category/model/categoryModel'
import container from '../inversify'
import { TYPES } from '../inversify.types';
import { BrandModel } from '../../module/brand/module';
import { MotherboardModel } from '../../module/PCBuilder/motherboard/module';
import { RamModel } from '../../module/PCBuilder/ram/model/ramModel';
import { ProcessorModel } from '../../module/PCBuilder/processor/module';
import { VideoCardModel } from '../../module/PCBuilder/video-card/module';
import { CabinetModel } from '../../module/PCBuilder/cabinet/module';
import { PowerSupplyModel } from '../../module/PCBuilder/power-supply/module';
import { DiskStorageModel } from '../../module/PCBuilder/disk-storage/module';
import { PermissionModel, RoleModel } from '../../module/authorization/module';
import { UserModel } from '../../module/user/module';
import { hash } from 'bcrypt'
import { PowerSupply } from '../../module/PCBuilder/power-supply/entities/PowerSupply';

async function configureDatabase() {

    const database = container.get<Sequelize>(TYPES.Common.Database);
    const configure = async (): Promise<void> => {
        try {
            await database.drop({ cascade: true });
            MotherboardModel.setup(database);
            ProductModel.setup(database);
            CategoryModel.setup(database);
            BrandModel.setup(database);
            MotherboardModel.setup(database);
            RamModel.setup(database);
            ProcessorModel.setup(database);
            VideoCardModel.setup(database);
            CabinetModel.setup(database);
            PowerSupplyModel.setup(database);
            DiskStorageModel.setup(database);
            PermissionModel.setup(database);
            RoleModel.setup(database);
            UserModel.setup(database)
            ProductModel.setupCategoryAssociation(container.get<typeof CategoryModel>(TYPES.Category.Model));
            ProductModel.setupBrandAssociation(container.get<typeof BrandModel>(TYPES.Brand.Model));
            MotherboardModel.setupProductAssociation(container.get<typeof ProductModel>(TYPES.Product.Model))
            RamModel.setupProductAssociation(container.get<typeof ProductModel>(TYPES.Product.Model))
            ProcessorModel.setupProductAssociation(container.get<typeof ProductModel>(TYPES.Product.Model))
            VideoCardModel.setupProductAssociation(container.get<typeof ProductModel>(TYPES.Product.Model));
            CabinetModel.setupProductAssociation(container.get<typeof ProductModel>(TYPES.Product.Model))
            PowerSupplyModel.setupProductAssociation(container.get<typeof ProductModel>(TYPES.Product.Model))
            DiskStorageModel.setupProductAssociation(container.get<typeof ProductModel>(TYPES.Product.Model))
            RoleModel.setupPermissionAssociation(container.get<typeof PermissionModel>(TYPES.Authorization.Permission.Model));
            UserModel.setupRoleAssociation(container.get<typeof RoleModel>(TYPES.Authorization.Role.Model))
            // RoleModel.setupUserAssociation(container.get<typeof UserModel>(TYPES.User.Model))
            // PermissionModel.setupRoleAssociation(container.get<typeof RoleModel>(TYPES.Authorization.Role.Model));
        } catch (err) {
            console.log('config')
            console.log(err.message)
        }

    }
    const createData = async () => {
        try {
            await database.sync({ force: true })
            await bootstrapCategories()
            await seedBrand()
            await seedProduct()
            await seedCabinet()
            await seedDiskStorage()
            await seedMotherboard()
            await seedPowerSupply()
            await seedProcessor()
            await seedRam()
            await seedVideoCard()
            await seedRole()
            await seedPermission()
            await seedUser()
            console.log('exito!')
        } catch (err) {

            console.log(err)
        }
    }
    await configure()
    await createData()
}

const bootstrapCategories = async (): Promise<void> => {
    await CategoryModel.create({ name: "cabinet" })
    await CategoryModel.create({ name: "disk-storage" })
    await CategoryModel.create({ name: "motherboard" })
    await CategoryModel.create({ name: "power-supply" })
    await CategoryModel.create({ name: "processor" })
    await CategoryModel.create({ name: "ram" })
    await CategoryModel.create({ name: "video-card" })
    await CategoryModel.create({ name: "keyboard" })
    await CategoryModel.create({ name: "software" })
    await CategoryModel.create({ name: "head-sets" })
    console.log('Base categories created successfuly')
}

const seedBrand = async (): Promise<void> => {
    await BrandModel.create({ name: 'AMD', logo: null })
    await BrandModel.create({ name: 'INTEL', logo: null })
    await BrandModel.create({ name: 'HyperX', logo: null })
}

const seedProduct = async (): Promise<void> => {
    await ProductModel.create({ name: 'product1', description: 'product description', id_category: 9, id_brand: 1, image: null, stock: true, price: 120 })
    await ProductModel.create({ name: 'product2', description: 'product description', id_category: 10, id_brand: 2, image: null, stock: true, price: 240 })
    await ProductModel.create({ name: 'product3', description: 'product description', id_category: 3, id_brand: 3, image: null, stock: true, price: 360 })
    await ProductModel.create({ name: 'product4', description: 'product description', id_category: 1, id_brand: 1, image: null, stock: true, price: 120 })
    await ProductModel.create({ name: 'product5', description: 'product description', id_category: 2, id_brand: 2, image: null, stock: true, price: 240 })
    await ProductModel.create({ name: 'product6', description: 'product description', id_category: 3, id_brand: 3, image: null, stock: true, price: 360 })
    await ProductModel.create({ name: 'product7', description: 'product description', id_category: 1, id_brand: 1, image: null, stock: true, price: 120 })
    await ProductModel.create({ name: 'product8', description: 'product description', id_category: 2, id_brand: 2, image: null, stock: true, price: 240 })
    await ProductModel.create({ name: 'product9', description: 'product description', id_category: 3, id_brand: 3, image: null, stock: true, price: 360 })
    await ProductModel.create({ name: 'product10', description: 'product description', id_category: 1, id_brand: 1, image: null, stock: true, price: 120 })
    await ProductModel.create({ name: 'product11', description: 'product description', id_category: 2, id_brand: 2, image: null, stock: true, price: 240 })
    await ProductModel.create({ name: 'product12', description: 'product description', id_category: 3, id_brand: 3, image: null, stock: true, price: 360 })
    await ProductModel.create({ name: 'product13', description: 'product description', id_category: 1, id_brand: 1, image: null, stock: true, price: 120 })
    await ProductModel.create({ name: 'product14', description: 'product description', id_category: 2, id_brand: 2, image: null, stock: true, price: 240 })
    await ProductModel.create({ name: 'product15', description: 'product description', id_category: 3, id_brand: 3, image: null, stock: true, price: 360 })
    await ProductModel.create({ name: 'product16', description: 'product description', id_category: 3, id_brand: 3, image: null, stock: true, price: 360 })
}

const seedCabinet = async (): Promise<void> => {
    await CabinetModel.create({ size: "Mini-ATX", generic_pws: true, id_product: 3 })
    await CabinetModel.create({ size: "ATX", generic_pws: true, id_product: 4 })
    console.log('Cabinet seeded')
}

const seedDiskStorage = async (): Promise<void> => {
    await DiskStorageModel.create({ watts: 120, type: 'HDD', total_storage: 500, mbs: 120, id_product: 5 })
    await DiskStorageModel.create({ watts: 180, type: 'SSD', total_storage: 1000, mbs: 500, id_product: 6 })
    console.log('DiskStorage seeded')
}

const seedMotherboard = async (): Promise<void> => {
    await MotherboardModel.create({ cpu_brand: 'AMD', cpu_socket: 'socket1', max_frec: 1600, min_frec: 1200, model_size: 'ATX', ram_version: 'DDR4', id_product: 7, watts: 80, video_socket: 'DDR5' })
    await MotherboardModel.create({ cpu_brand: 'INTEL', cpu_socket: 'socket1', max_frec: 1600, min_frec: 1200, model_size: 'ATX', ram_version: 'DDR3', id_product: 8, watts: 85, video_socket: 'DDR5' })
    console.log('Motherboard seeded')
}

const seedPowerSupply = async (): Promise<void> => {
    await PowerSupplyModel.create({ certification: 'GENERIC', watts: 450, id_product: 9 })
    await PowerSupplyModel.create({ certification: 'PLUS GOLD', watts: 550, id_product: 10 })
    console.log('PowerSupply seeded')
}

const seedProcessor = async (): Promise<void> => {
    await ProcessorModel.create({ cores: 4, frecuency: 3800, socket: 'processor_socket1', watts: 140, id_product: 11 })
    await ProcessorModel.create({ cores: 2, frecuency: 2800, socket: 'processor_socket2', watts: 80, id_product: 12 })
    console.log('Processor seeded')
}

const seedRam = async (): Promise<void> => {
    await RamModel.create({ ram_version: 'DDR3', watts: 20, min_frec: 800, max_frec: 1400, memory: 4, id_product: 13 })
    await RamModel.create({ ram_version: 'DDR4', watts: 25, min_frec: 1200, max_frec: 1800, memory: 8, id_product: 14 })
    console.log('Ram seeded')
}

const seedVideoCard = async (): Promise<void> => {
    await VideoCardModel.create({ clock_speed: 1800, memory: 4, version: 'DDR5', watts: 140, id_product: 15 })
    await VideoCardModel.create({ clock_speed: 1800, memory: 4, version: 'DDR5', watts: 140, id_product: 16 })
    console.log('VideoCard seeded')
}

const seedRole = async () => {
    await RoleModel.create({ name: 'admin' })
    await RoleModel.create({ name: 'client' })
    console.log('Role seeded')
}

const seedPermission = async () => {
    await PermissionModel.create({ action: "manage", subject: "all", role_id: 1 })
    await PermissionModel.create({ action: "update", subject: "User", role_id: 2, conditions: JSON.stringify({ id: "${id}" }) })
    await PermissionModel.create({ action: "delete", subject: "User", role_id: 2, conditions: JSON.stringify({ id: "${id}" }) })
    console.log('Permission seeded')
}

const seedUser = async () => {
    const adminPassword = await hash(<string>process.env.ADMIN_PASSWORD, Number(<string>process.env.BCRYPT_SALT_NUMBER))
    await UserModel.create({ mail: <string>process.env.ADMIN_MAIL, password: adminPassword, role_id: 1 })
    console.log('User seeded')
}

configureDatabase()

