import { inject, injectable } from "inversify";
import { Op, WhereOptions } from "sequelize";
import { TYPES } from "../../../config/inversify.types";
import { AbstractRepository } from "../../abstractClasses/abstractRepository";
import { Product } from "../entity/Product";
import { ProductError } from "../error/ProductError";
import { IProductCreate } from "../interfaces/IProductCreate";
import { IProductEdit } from "../interfaces/IProductEdit";
import { fromDbToProduct } from "../mapper/productMapper";
import { ProductModel } from "../model/productModel";
import { GetProductsDto } from "../dto/getProductsDto";
import { GetProductsReqDto } from "../dto/getProductsReqDto";




@injectable()
export class ProductRepository extends AbstractRepository {
    private productModel: typeof ProductModel
    constructor(
        @inject(TYPES.Product.Model) productModel: typeof ProductModel
    ) {
        super()
        this.productModel = productModel
    }

    public async getAllProduct(querieParams: GetProductsReqDto): Promise<Error | GetProductsDto> {
        const { limit, offset, category_id, name } = querieParams

        const whereOptions: WhereOptions<Product> = {}
        name ? whereOptions.name = { [Op.substring]: querieParams.name } : ''
        category_id ? whereOptions.id_category = querieParams.category_id : ''

        const { count, rows } = await this.productModel.findAndCountAll({ where: whereOptions, limit, offset, include: [ProductModel.associations.brand, ProductModel.associations.category] })
        const products = rows.map(fromDbToProduct)
        const response = new GetProductsDto(count, products)
        return response
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