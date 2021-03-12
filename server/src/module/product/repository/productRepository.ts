import { inject, injectable } from "inversify";
import { Op } from "sequelize";
import { TYPES } from "../../../config/inversify.types";
import { AbstractRepository } from "../../abstractClasses/abstractRepository";
import { FullProduct } from "../entity/FullProduct";
import { Product } from "../entity/Product";
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

        try {
            const response = await this.productModel.findAll({ include: ["category", "brand"] })

            if (!response) {
                throw new Error()

            }
            return response.map(fromDbToFullProduct)
        } catch (err) {
            console.log("error: ", err)
            throw Error(err)
        }

    }

    public async getById(id: number): Promise<Error | FullProduct> {

        const response = await this.productModel.findByPk(id, { include: ["category", "brand"] })
        if (!response) {
            throw Error("product not found")
        }

        return fromDbToFullProduct(response)
    }

    public async createProduct(product: Product): Promise<Error | Product> {
        try {
            const response = await this.productModel.create(product, {include: ["category", "brand"]})
            return fromDbToProduct(response)
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

    public async modifyProduct(product: IEditableProduct): Promise<Error | FullProduct> {
        if (!product.id) {
            throw Error("Product should have an id.")
        }
        try {
            const editableProduct = await this.productModel.update(product, { where: { id: product.id }, returning: true })
            // update returns an array, first argument is the number of elements updated in the
            // database. Second argument are the array of elements. Im updating by id so there is only 
            // one element in the array.
            const newProduct = fromDbToFullProduct(editableProduct[1][0])
            return newProduct

        } catch (err) {
            throw Error(err)
        }
    }

    public async getProductsByName(name: string): Promise<FullProduct[] | Error> {
        if (!name) {
            throw Error("missing product name")
        }
        try {
            const response = await this.productModel.findAll({
                where: {
                    name: {
                        [Op.substring]: name
                    }
                },
                include: ["category", "brand"]
            })
            return response.map(fromDbToFullProduct)
        } catch (e) {
            throw Error(e)
        }
    }
}