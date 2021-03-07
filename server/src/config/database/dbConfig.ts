import dotenv from 'dotenv'
dotenv.config()
import "reflect-metadata";
import { Sequelize } from 'sequelize/types';
import ProductModel from '../../module/product/model/productModel';
import container from '../inversify'
import { TYPES } from '../inversify.types';



const database = container.get<Sequelize>(TYPES.Database);
ProductModel.drop()
ProductModel.setup(database);

(async function configureDatabase() {
    await database.sync({ force: true })

    const a = await ProductModel.create({ name: "nombreDeProducto123", brand: "brand-test", image: "image-test", description: "description-test", price: 12345, stock: true })
    const b = await ProductModel.create({ name: "nombreDeProducto123-b", brand: "brand-test-b", image: "image-test-b", description: "description-test-b", price: 123456, stock: true })
    console.log(a)
    console.log(b)

    console.log('Database configurada con exito!')
})()

