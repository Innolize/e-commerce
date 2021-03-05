import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractRepository } from "../../abstractClasses/abstractRepository";
import ProductModel from "../model/productModel";

@injectable()
export class ProductRepository extends AbstractRepository {
    private productModel : typeof ProductModel
    constructor(
        @inject(TYPES.ProductModel) productModel: typeof ProductModel
    ) {
        super()
        this.productModel = productModel
    }

    public async getAllProducts() {
        const response = await this.productModel.create({ name: "nombreDeProducto123-c", brand: "brand-test-b", image: "image-test-b", description: "description-test-b", price: 123456, stock: 3 })
        console.log(response)
        
    }
}