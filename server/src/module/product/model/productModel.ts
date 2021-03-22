import { decorate, injectable } from "inversify";
import { DataTypes, Sequelize } from "sequelize";
import { Model } from "sequelize";
import { CategoryModel } from "../../category/module";
import { IProductModel } from "../interfaces/IProduct";
import { IFullProduct } from '../entity/FullProduct'
import { BrandModel } from "../../brand/module";

decorate(injectable(), (Model))

@injectable()
export class ProductModel extends Model<IProductModel | IFullProduct>{


    static setup(database: Sequelize): typeof ProductModel {
        ProductModel.init({
            id: {
                primaryKey: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    min: 4,
                    max: 20
                }
            },
            image: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            price: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            stock: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            }
        }, {
            sequelize: database,
            modelName: "Product",
            createdAt: "creadoEn",
            updatedAt: "modificadoEn",
        })
        return ProductModel
    }
    static setupCategoryAssociation(model: typeof CategoryModel): void {
        ProductModel.belongsTo(model, {
            as: "category",
            foreignKey: "id_category",
        })
    }
    static setupBrandAssociation(model: typeof BrandModel): void {
        ProductModel.belongsTo(model, {
            as: "brand",
            foreignKey: "id_brand",
        })
    }
}