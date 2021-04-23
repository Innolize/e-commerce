import { DataTypes, Sequelize } from "sequelize";
import { Model } from "sequelize";
import { IRoleCreate } from "../interfaces/IRoleCreate";
import { IPermissionModelAttributes } from "../interfaces/IPermissionModelAttributes";
import { ACTIONS, SUBJECTS } from "../../../config/constants/roles";

export class RoleModel extends Model<IPermissionModelAttributes, IRoleCreate>{
    setup(database: Sequelize): typeof RoleModel {
        RoleModel.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            action: {
                type: DataTypes.ENUM(...ACTIONS)
            },
            subject:{
                type: DataTypes.ENUM(...SUBJECTS)
            }
        }, {
            sequelize: database,
            modelName: "User",
            createdAt: "creadoEn",
            updatedAt: "modificadoEn"
        })
        return RoleModel
    }
    // static setupRolePermission(){

    // }

}