import { inject, injectable } from "inversify";
import { Model } from "sequelize/types";
import { TYPES } from "../../../config/inversify.types";
import { AbstractRepository } from "../../abstractClasses/abstractRepository";
import { Product } from "../entity/Product";
import { IProduct } from "../interfaces/IProduct";
import { fromDbToEntity } from "../mapper/productMapper";
import ProductModel from "../model/productModel";

@injectable()
export class ProductRepository extends AbstractRepository {
    private productModel: typeof ProductModel
    constructor(
        @inject(TYPES.ProductModel) productModel: typeof ProductModel
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
    public async deleteProduct(productId: number): Promise<Error | Boolean> {
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

    public async editProduct(product: Product) {
        if (!product.id) {
            throw Error("Product should have an id.")
        }
        const editableProduct = await this.productModel.update(product, { where: { id: product.id } })
        console.log(editableProduct)

    }
    public async getProductsByName(name: string) {
        if (!name) {
            throw Error("missing product name")
        }
        try {
            const response = await this.productModel.findAll({ where: { name } })
            if (!response) {
                throw Error("No products found with that name")
            }
            return response.map(fromDbToEntity)
        } catch (e) {
            throw Error(e)
        }

    }
}