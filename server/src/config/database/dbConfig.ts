import { Sequelize } from 'sequelize/types';
import ProductModel from '../../module/product/model/productModel';
import container from '../inversify'
import { TYPES } from '../inversify.types';



const database = container.get<Sequelize>(TYPES.database);
ProductModel.setup(database);

(async function configureDatabase() {
    await database.sync({ force: true })

    const a = await ProductModel.create({ nombre: "nombreDeProducto123" })
    const b = await ProductModel.create({ nombre: "nombreDeProducto345" })
    console.log(a)
    console.log(b)

    console.log('Database configurada con exito!')
})()

