import { inject, injectable } from "inversify";
import { Op, WhereOptions } from "sequelize";
import { TYPES } from "../../../config/inversify.types";
import { AbstractRepository } from "../../abstractClasses/abstractRepository";
import { Product } from "../entity/Product";
import { ProductError } from "../error/ProductError";
import { IGetAllProductsQueries } from "../interfaces/IGetAllProductsQueries";
import { IProductCreate } from "../interfaces/IProductCreate";
import { IProductEdit } from "../interfaces/IProductEdit";
import { fromDbToProduct } from "../mapper/productMapper";
import { ProductModel } from "../model/productModel";




@injectable()
export class ProductRepository extends AbstractRepository {
    private productModel: typeof ProductModel
    constructor(
        @inject(TYPES.Product.Model) productModel: typeof ProductModel
    ) {
        super()
        this.productModel = productModel
    }

    public async getAllProduct(querieParams?: IGetAllProductsQueries): Promise<Error | Product[]> {
        const findQuery: WhereOptions<Product> = {}
        if (querieParams) {
            querieParams.name ? findQuery.name = { [Op.substring]: querieParams.name } : ''
            querieParams.category_id ? findQuery.id_category = querieParams.category_id : ''
        }
        const response = await this.productModel.findAll({ where: findQuery, include: [ProductModel.associations.brand, ProductModel.associations.category] })
        return response.map(fromDbToProduct)


    }

    public async getById(id: number): Promise<Error | Product> {

        const product = await this.productModel.findByPk(id, { include: [ProductModel.associations.brand, ProductModel.associations.category] })
        if (!product) {
            throw ProductError.notFound()
        }
        return fromDbToProduct(product)

    }

    public async createProduct(product: IProductCreate): Promise<Error | Product> {
        try {
            const newProduct = await this.productModel.create(product, { isNewRecord: true })
            return fromDbToProduct(newProduct)
        } catch (e) {
            throw new Error(e)
        }
    }

    public async deleteProduct(productId: number): Promise<Error | boolean> {
        const deletedProduct = await this.productModel.destroy({ where: { id: productId } })
        if (!deletedProduct) {
            throw ProductError.notFound()
        }
        return true
    }

    public async modifyProduct(product: IProductEdit): Promise<Error | Product> {

        const [productEdited, productArray] = await this.productModel.update(product, { where: { id: product.id }, returning: true })
        // update returns an array, first argument is the number of elements updated in the
        // database. Second argument are the array of elements. Im updating by id so there is only 
        // one element in the array.
        if (!productEdited) {
            throw ProductError.notFound()
        }
        const newProduct = fromDbToProduct(productArray[0])

        return newProduct


    }
}