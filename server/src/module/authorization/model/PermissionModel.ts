import { DataTypes, Sequelize } from "sequelize";
import { Model } from "sequelize";
import { IPermissionModelAttributes } from "../interfaces/IPermissionModelAttributes";
import { injectable } from "inversify";
import { IPermissionCreateModelAttributes } from "../interfaces/IPermissionCreateModelAttributes";
import { actions,subjects } from '../../authorization/util/abilityBuilder'

@injectable()
export class PermissionModel extends Model<IPermissionModelAttributes, IPermissionCreateModelAttributes>{
    static setup(database: Sequelize): typeof PermissionModel {
        PermissionModel.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            action: {
                type: DataTypes.ENUM(...actions),
                allowNull: false
            },
            subject: {
                type: DataTypes.ENUM(...subjects),
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