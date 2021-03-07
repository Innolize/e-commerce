import dotenv from 'dotenv'
dotenv.config()
import "reflect-metadata";
import { Sequelize } from 'sequelize/types';
import { ProductModel } from '../../module/product/model/productModel';
import { CategoryModel } from '../../module/category/model/categoryModel'
import container from '../inversify'
import { TYPES } from '../inversify.types';



const database = container.get<Sequelize>(TYPES.Common.Database);
CategoryModel.drop()
ProductModel.drop()
ProductModel.setup(database);
CategoryModel.setup(database);

(async function configureDatabase() {
    await database.sync({ force: true })

    const a = await ProductModel.create({ name: "nombreDeProducto123", brand: "brand-test", image: "image-test", description: "description-test", price: 12345, stock: true })
    const b = await ProductModel.create({ name: "nombreDeProducto123-b", brand: "brand-test-b", image: "image-test-b", description: "description-test-b", price: 123456, stock: true })
    const c = await CategoryModel.create({ name: "testname" })
    console.log(a)
    console.log(b)
    console.log(c)

    console.log('Database configurada con exito!')
})()

