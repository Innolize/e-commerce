import { inject, injectable } from "inversify";
import { Op } from "sequelize";
import { TYPES } from "../../../config/inversify.types";
import { AbstractRepository } from "../../abstractClasses/abstractRepository";
import { Product } from "../entity/Product";
import { IEditableProduct } from "../interfaces/IEditableProduct";
import { IProduct } from "../interfaces/IProduct";
import { fromDbToEntity } from "../mapper/productMapper";
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

    public async getAllProduct(): Promise<Error | IProduct[]> {
        const response = await this.productModel.findAll()
        if (!response) {
            throw new Error()

        }
        return response.map(fromDbToEntity)
    }

    public async getById(id: number): Promise<Error | IProduct> {
        if (!id) {
            throw Error("missing id")
        }
        const response = await this.productModel.findByPk(id)
        if (!response) {
            throw Error("product not found")
        }

        return fromDbToEntity(response)
    }

    public async createProduct(product: IProduct): Promise<Error | IProduct> {
        if (!product) {
            throw Error('missing product')
        }
        try {
            const response = await this.productModel.create(product)
            return fromDbToEntity(response)
        } catch (e) {
            throw Error(e)
        }
    }
    public async deleteProduct(productId: number): Promise<Error | boolean> {
        if (!productId && productId !== 0) {
            throw Error('missing product')
        }
        const response = await this.productModel.destroy({
            where:
                { id: productId }
        })
        if (!response) {
            return false
        }
        return true
    }

    public async modifyProduct(product: IEditableProduct): Promise<Error | Product> {
        if (!product.id) {
            throw Error("Product should have an id.")
        }
        try {
            const editableProduct = await this.productModel.update(product, { where: { id: product.id }, returning: true })
            // update returns an array, first argument is the number of elements updated in the
            // database. Second argument are the array of elements. Im updating by id so there is only 
            // one element in the array.
            const newProduct = fromDbToEntity(editableProduct[1][0])
            return newProduct

        } catch (err) {
            throw Error(err)
        }
    }

    public async getProductsByName(name: string): Promise<Product[] | Error> {
        if (!name) {
            throw Error("missing product name")
        }
        try {
            const response = await this.productModel.findAll({
                where: {
                    name: {
                        [Op.substring]: name
                    }
                }
            })
            return response.map(fromDbToEntity)
        } catch (e) {
            throw Error(e)
        }
    }
}