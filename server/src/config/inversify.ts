import { Container } from "inversify"
import { Sequelize } from "sequelize"
import ProductController from "../module/product/controller/productController"
import ProductModel from "../module/product/model/productModel"
import { ProductRepository } from "../module/product/repository/productRepository"
import { ProductService } from "../module/product/service/productService"
import { TYPES } from './inversify.types'
import multer, { Multer } from 'multer'
import path from 'path'

function configureUploadMiddleware() {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, <string>process.env.PRODUCT_IMAGE_FOLDER)
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
        }
    })
    return multer({ storage })
}

function configureDatabase() {
    return new Sequelize(<string>process.env.DATABASE_URL, {
        logging: false,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,

    })
}

export function configProductModel(container: Container) {
    ProductModel.setup(container.get(TYPES.Database))
    return ProductModel
}


const dependencyContainer = new Container()
dependencyContainer.bind<Sequelize>(TYPES.Database).toConstantValue(configureDatabase());
dependencyContainer.bind<Multer>(TYPES.UploadMiddleware).toConstantValue(configureUploadMiddleware());
dependencyContainer.bind<typeof ProductModel>(TYPES.ProductModel).toConstantValue(configProductModel(dependencyContainer));
dependencyContainer.bind<ProductRepository>(TYPES.ProductRepository).to(ProductRepository)
dependencyContainer.bind<ProductService>(TYPES.ProductService).to(ProductService)
dependencyContainer.bind<ProductController>(TYPES.ProductController).to(ProductController)


// dependencyContainer.get<Sequelize>("database")




export default dependencyContainer