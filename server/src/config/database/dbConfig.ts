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
            // PermissionModel.setupRoleAssociation(container.get<typeof RoleModel>(TYPES.Authorization.Role.Model));
        } catch (err) {
            console.log('config')
            console.log(err.message)
        }

    }



    const createData = async () => {


        try {
            console.log('live')
            await database.sync({ force: true })

            await CategoryModel.create({ name: "testname" })
            await BrandModel.create({ name: "brandTest", logo: "test-logo" })
            await ProductModel.create({ name: "nombreDeProducto123", id_brand: 1, image: "image-test", description: "description-test", price: 12345, stock: true, id_category: 1 })
            await ProductModel.create({ name: "nombreDeProducto123-b", id_brand: 1, image: "image-test-b", description: "description-test-b", price: 123456, stock: true, id_category: 1 })
            await RoleModel.create({ name: 'admin' })
            await PermissionModel.create({ action: "create", subject: "Brand", role_id: 1 })
            await PermissionModel.create({ action: "read", subject: "Brand", role_id: 1 })
            await PermissionModel.create({ action: "delete", subject: "Brand", role_id: 1 })


            const response = await RoleModel.findByPk(1, { include: "Permissions" })

            console.log(response?.toJSON());
            await RamModel.create({ watts: 20, id_product: 2, max_frec: 1200, memory: 12, min_frec: 1300, ram_version: 'DDR4' })
            // const products = await ProductModel.findAll({ include: ["category", "brand"] })
            // const final = products.map(fromDbToFullProduct)
            console.log('exito!')
        } catch (err) {

            console.log(err.message)
        }
    }
    await configure()
    await createData()
}

configureDatabase()

