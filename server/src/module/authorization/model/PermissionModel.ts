import { DataTypes, Sequelize } from "sequelize";
import { Model } from "sequelize";
import { IPermissionModelAttributes } from "../interfaces/IPermissionModelAttributes";
import { ACTIONS, SUBJECTS } from "../../../config/constants/roles";
import { injectable } from "inversify";
import { IPermissionCreate } from "../interfaces/IPermissionCreate";

@injectable()
export class PermissionModel extends Model<IPermissionModelAttributes, IPermissionCreate>{
    static setup(database: Sequelize): typeof PermissionModel {
        PermissionModel.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            action: {
                type: DataTypes.ENUM(...ACTIONS),
                allowNull: false
            },
            subject: {
                type: DataTypes.ENUM(...SUBJECTS),
                allowNull: false
            },
            conditions: {
                type: DataTypes.TEXT,
            }
        }, {
            sequelize: database,
            modelName: "Permission",
            createdAt: "creadoEn",
            updatedAt: "modificadoEn"
        })
        return PermissionModel
    }
}