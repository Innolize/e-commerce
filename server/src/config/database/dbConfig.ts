require('dotenv').config()
import { Sequelize } from 'sequelize/types';
import ProductModel from '../../module/product/model/productModel';
import container from '../inversify'
import { TYPES } from '../inversify.types';



const database = container.get<Sequelize>(TYPES.database);
ProductModel.setup(database);

(async function configureDatabase() {
    await database.sync({ force: true })

    const a = await ProductModel.create({ name: "nombreDeProducto123", brand: "brand-test", image: "image-test", description: "description-test", price: 12345, stock: 13 })
    const b = await ProductModel.create({ name: "nombreDeProducto123-b", brand: "brand-test-b", image: "image-test-b", description: "description-test-b", price: 123456, stock: 3 })
    console.log(a)
    console.log(b)

    console.log('Database configurada con exito!')
})()

