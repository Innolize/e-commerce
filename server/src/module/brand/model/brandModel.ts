import { injectable } from "inversify";
import { DataTypes, Sequelize } from "sequelize";
import { Model } from "sequelize";
import { IBrand } from "../interfaces/IBrand";

// decorate(injectable(), (Model))

@injectable()
export class BrandModel extends Model<IBrand>{

    static setup(database: Sequelize): typeof BrandModel {
        BrandModel.init({
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
                    min: 3,
                    max: 20
                }
            }
        }, {
            sequelize: database,
            modelName: "Brand",
        })
        return BrandModel
    }
}