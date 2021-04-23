import { DataTypes, Sequelize } from "sequelize";
import { Model } from "sequelize";
import { IRoleCreate } from "../interfaces/IRoleCreate";
import { IRoleModelAttributes } from "../interfaces/IRoleModelAttributes";

export class RoleModel extends Model<IRoleModelAttributes, IRoleCreate>{
    setup(database: Sequelize): typeof RoleModel {
        RoleModel.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
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