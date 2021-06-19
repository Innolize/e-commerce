import { DataTypes, Sequelize } from "sequelize";
import { Model } from "sequelize";
import { injectable } from "inversify";
import { actions, subjects } from '../../authorization/util/abilityBuilder'
import { IPermission } from "../interfaces/IPermission";
import { RoleModel } from "./RoleModel";
import { IPermissionCreate } from "../interfaces/IPermissionCreate";
import { IPermissionModelAttributes } from "../interfaces/IPermissionModelAttributes";

@injectable()
export class PermissionModel extends Model<IPermissionModelAttributes, IPermissionCreate> implements IPermission {
    role_id: number
    action: typeof actions[number]
    subject: typeof subjects[number]
    id: number
    condition: string
    static setup(database: Sequelize): typeof PermissionModel {
        PermissionModel.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            role_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            action: {
                type: DataTypes.ENUM(...actions),
                allowNull: false
            },
            subject: {
                type: DataTypes.ENUM(...subjects),
                allowNull: false
            },
            condition: {
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

    static setupPermissionAssociation(model: typeof RoleModel): typeof PermissionModel {
        PermissionModel.belongsTo(model, {
            targetKey: 'role_id'
        });
        return PermissionModel
    }
}