import dotenv from 'dotenv'
dotenv.config()
import "reflect-metadata";
import { Sequelize } from 'sequelize/types';
import { ProductModel } from '../../module/product/model/productModel';
import { CategoryModel } from '../../module/category/model/categoryModel'
import container from '../inversify'
import { TYPES } from '../inversify.types';
import { BrandModel } from '../../module/brand/module';



const database = container.get<Sequelize>(TYPES.Common.Database);
CategoryModel.drop({ cascade: true })
ProductModel.drop({ cascade: true })
BrandModel.drop({ cascade: true })
ProductModel.setup(database);
CategoryModel.setup(database);
BrandModel.setup(database)
ProductModel.setupCategoryAssociation(container.get<typeof CategoryModel>(TYPES.Category.Model));
ProductModel.setupBrandAssociation(container.get<typeof BrandModel>(TYPES.Brand.Model));


(async function configureDatabase() {
    await database.sync({ force: true })

    try {
        await CategoryModel.create({ name: "testname" })
        await BrandModel.create({ name: "brandTest" })
        await ProductModel.create({ name: "nombreDeProducto123", id_brand: 1, image: "image-test", description: "description-test", price: 12345, stock: true, id_category: 1 })
        await ProductModel.create({ name: "nombreDeProducto123-b", id_brand: 1, image: "image-test-b", description: "description-test-b", price: 123456, stock: true, id_category: 1 })
        const esto = await ProductModel.findAll({ where: { id_category: 1 }, include: ["category", "brand"] })
        console.log(esto)


        // console.log(a)
        // console.log(b)
        // console.log(c)
        console.log('exito!')
    } catch (err) {
        console.log(err)
    }




})()

