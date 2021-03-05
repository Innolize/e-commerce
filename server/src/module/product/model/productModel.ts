import { DataTypes, Sequelize } from "sequelize";
import { Model } from "sequelize";


class ProductModel extends Model {
    static setup(database: Sequelize) {
        ProductModel.init({
            // id: {
            //     primaryKey: true,
            //     type: DataTypes.INTEGER,
            //     allowNull: false,
            //     autoIncrement: true
            // },
            nombre: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    min: 4,
                    max: 20
                }
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