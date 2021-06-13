import { decorate, injectable } from "inversify";
import { Association, DataTypes, Sequelize } from "sequelize";
import { Model } from "sequelize";
import { CategoryModel } from "../../category/module";
import { IProduct } from "../interfaces/IProduct";
import { BrandModel } from "../../brand/module";
import { IProductCreate } from "../interfaces/IProductCreate";
import { Product } from "../entity/Product";
import { Category } from "../../category/entity/Category";
import { Brand } from "../../brand/entity/Brand";

decorate(injectable(), (Model))

@injectable()
export class ProductModel extends Model<Product, IProductCreate> implements IProduct {

    id?: number | undefined;
    name: string;
    image: string | null;
    description: string | null;
    price: number;
    stock: boolean;
    id_category: number;
    id_brand: number;
    category?: Category | undefined;
    brand?: Brand | undefined;

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
            },
            id_brand: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            id_category: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
            {
                sequelize: database,
                modelName: "Product",
                createdAt: "creadoEn",
                updatedAt: "modificadoEn"
            })
        return ProductModel
    }
    static setupCategoryAssociation(model: typeof CategoryModel): void {
        ProductModel.belongsTo(model, {
            as: "category",
            foreignKey: "id_category",
            onDelete: "cascade"
        })
    }
    static setupBrandAssociation(model: typeof BrandModel): void {
        ProductModel.belongsTo(model, {
            as: "brand",
            foreignKey: "id_brand",
        })
    }

    public static associations: {
        category: Association<ProductModel, CategoryModel>,
        brand: Association<ProductModel, CategoryModel>
    }
}