import { injectable } from "inversify";
import { Association, DataTypes, Sequelize } from "sequelize";
import { Model } from "sequelize";
import { UserModel } from "../../user/module";
import { IRoleCreate } from "../interfaces/IRoleCreate";
import { IRoleModelAttributes } from "../interfaces/IRoleModelAttributes";
import { PermissionModel } from "./PermissionModel";

@injectable()
export class RoleModel extends Model<IRoleModelAttributes, IRoleCreate>{
    static setup(database: Sequelize): typeof RoleModel {
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
            modelName: "Role",
            createdAt: "creadoEn",
            updatedAt: "modificadoEn"
        })
        return RoleModel
    }
    static setupPermissionAssociation(model: typeof PermissionModel): typeof RoleModel {
        RoleModel.hasMany(model, {
            sourceKey: 'id',
            foreignKey: 'role_id',
            as: 'permissions',
            onDelete: "cascade"
        });
        return RoleModel
    }

    // static setupUserAssociation(model: typeof UserModel): typeof RoleModel {
    //     RoleModel.belongsTo(model);
    //     return RoleModel
    // }
    static associations: {
        permissions: Association<PermissionModel, RoleModel>
    }

}