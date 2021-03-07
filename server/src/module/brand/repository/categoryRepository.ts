import { inject, injectable } from "inversify";
import { Op } from "sequelize";
import { TYPES } from "../../../config/inversify.types";
import { AbstractRepository } from "../../abstractClasses/abstractRepository";
import { ICategory } from "../interfaces/ICategory";
import { fromDbToCategory } from "../mapper/productMapper";
// import { Product } from "../entity/Product";
// import { IEditableProduct } from "../interfaces/IEditableProduct";
// import { ICategory } from "../interfaces/ICategory";
// import { fromDbToEntity } from "../mapper/productMapper";
import { CategoryModel } from "../model/categoryModel";

@injectable()
export class CategoryRepository extends AbstractRepository {
    private categoryModel: typeof CategoryModel
    constructor(
        @inject(TYPES.Category.Model) categoryModel: typeof CategoryModel
    ) {
        super()
        this.categoryModel = categoryModel
    }

    public async getAllCategories(): Promise<Error | ICategory[]> {
        console.log("llegue al repository")
        try {
            const response = await this.categoryModel.findAll()
            console.log(response)
            if (!response) {
                throw new Error()

            }
            return response.map(fromDbToCategory)
        } catch (err) {
            console.log(err)
            throw Error()
        }


    }

    // public async getById(id: number): Promise<Error | ICategory> {
    //     if (!id) {
    //         throw Error("missing id")
    //     }
    //     const response = await this.categoryModel.findByPk(id)
    //     if (!response) {
    //         throw Error("product not found")
    //     }

    //     return fromDbToEntity(response)
    // }

    // public async createProduct(product: ICategory): Promise<Error | ICategory> {
    //     if (!product) {
    //         throw Error('missing product')
    //     }
    //     try {
    //         const response = await this.categoryModel.create(product)
    //         return fromDbToEntity(response)
    //     } catch (e) {
    //         throw Error(e)
    //     }
    // }
    // public async deleteProduct(productId: number): Promise<Error | boolean> {
    //     if (!productId && productId !== 0) {
    //         throw Error('missing product')
    //     }
    //     const response = await this.categoryModel.destroy({
    //         where:
    //             { id: productId }
    //     })
    //     if (!response) {
    //         return false
    //     }
    //     return true
    // }

    // public async modifyProduct(product: IEditableProduct): Promise<Error | Product> {
    //     if (!product.id) {
    //         throw Error("Product should have an id.")
    //     }
    //     try {
    //         const editableProduct = await this.categoryModel.update(product, { where: { id: product.id }, returning: true })
    //         // update returns an array, first argument is the number of elements updated in the
    //         // database. Second argument are the array of elements. Im updating by id so there is only 
    //         // one element in the array.
    //         const newProduct = fromDbToEntity(editableProduct[1][0])
    //         return newProduct

    //     } catch (err) {
    //         throw Error(err)
    //     }
    // }

    // public async getProductsByName(name: string): Promise<Product[] | Error> {
    //     if (!name) {
    //         throw Error("missing product name")
    //     }
    //     try {
    //         const response = await this.categoryModel.findAll({
    //             where: {
    //                 name: {
    //                     [Op.substring]: name
    //                 }
    //             }
    //         })
    //         return response.map(fromDbToEntity)
    //     } catch (e) {
    //         throw Error(e)
    //     }
    // }
}