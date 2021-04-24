import { DataTypes, Sequelize } from "sequelize";
import { Model } from "sequelize";
import { IPermissionModelAttributes } from "../interfaces/IPermissionModelAttributes";
import { ACTIONS, SUBJECTS } from "../../../config/constants/roles";
import { RoleModel } from "./RoleModel";
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
                type: DataTypes.ENUM(...ACTIONS)
            },
            subject: {
                type: DataTypes.ENUM(...SUBJECTS)
            },
            role_id:{
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        }, {
            sequelize: database,
            modelName: "Permission",
            createdAt: "creadoEn",
            updatedAt: "modificadoEn"
        })
        return PermissionModel
    }
    // static setupRoleAssociation(model: typeof RoleModel): typeof PermissionModel {
    //     PermissionModel.belongsTo(model, {
    //         foreignKey: {
    //             allowNull: false,
    //             name: 'role_id'
    //         },
    //         as: 'Permissions',
    //         onDelete: "cascade"
    //     })
    //     return PermissionModel
    // }

}