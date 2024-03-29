import { injectable } from "inversify";
import { DataTypes, Sequelize } from "sequelize";
import { Model } from "sequelize";
import { IBrand } from "../interfaces/IBrand";
import { IBrandCreateModelAttributes } from "../interfaces/IBrandCreateModelAttributes";
import { IBrandModelAttributes } from "../interfaces/IBrandModelAttributes";

@injectable()
export class BrandModel extends Model<IBrandModelAttributes, IBrandCreateModelAttributes> implements IBrand {
    name: string;
    logo: string | null;
    id?: number | undefined;

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
            },
            logo: {
                type: DataTypes.STRING,
            }
        }, {
            sequelize: database,
            modelName: "Brand",
        })
        return BrandModel
    }
}