import { decorate, injectable } from "inversify";
import { DataTypes, Sequelize } from "sequelize";
import { Model } from "sequelize";
import { IProduct } from "../interfaces/IProduct";

decorate(injectable(), (Model))

@injectable()
class ProductModel extends Model<IProduct>{

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
            brand: {
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
}

export default ProductModel