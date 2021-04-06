import { inject, injectable } from "inversify";
import { Op } from "sequelize";
import { TYPES } from "../../../config/inversify.types";
import { AbstractRepository } from "../../abstractClasses/abstractRepository";
import { FullProduct } from "../entity/FullProduct";
import { Product } from "../entity/Product";
import { ICreateProduct } from "../interfaces/ICreateProduct";
import { IEditableProduct } from "../interfaces/IEditableProduct";
import { fromDbToFullProduct, fromDbToProduct } from "../mapper/productMapper";
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

    public async getAllProduct(): Promise<Error | FullProduct[]> {

        const response = await this.productModel.findAll({ include: ["category", "brand"] })

        return response.map(fromDbToFullProduct)


    }

    public async getById(id: number): Promise<Error | FullProduct> {

        const response = await this.productModel.findByPk(id, { include: ["category", "brand"] })
        if (!response) {
            throw new Error("Product not found")
        }
        return fromDbToFullProduct(response)

    }

    public async createProduct(product: ICreateProduct): Promise<Error | Product> {
        try {
            const response = await this.productModel.create(product, { include: ["category", "brand"], isNewRecord: true })
            return fromDbToProduct(response)
        } catch (e) {
            throw new Error(e)
        }
    }
    public async deleteProduct(productId: number): Promise<Error | boolean> {

        const response = await this.productModel.destroy({
            where:
                { id: productId }
        })
        if (!response) {
            throw new Error("Product doesnt exist")
        }
        return true
    }

    public async modifyProduct(product: IEditableProduct): Promise<Error | Product> {

        try {
            const [productEdited, productArray] = await this.productModel.update(product, { where: { id: product.id }, returning: true })
            // update returns an array, first argument is the number of elements updated in the
            // database. Second argument are the array of elements. Im updating by id so there is only 
            // one element in the array.
            if (!productEdited) {
                throw new Error("Product not found")
            }
            const newProduct = fromDbToProduct(productArray[0])

            return newProduct

        } catch (err) {
            throw new Error(err.message)
        }
    }

    public async getProductsByName(name: string): Promise<FullProduct[] | Error> {

        const response = await this.productModel.findAll({
            where: {
                name: {
                    [Op.substring]: name
                }
            },
            include: ["category", "brand"]
        })
        return response.map(fromDbToFullProduct)
    }
}