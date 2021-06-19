import { injectable } from "inversify";
import { Association, DataTypes, Sequelize } from "sequelize";
import { Model } from "sequelize";
import { Permission } from "../entities/Permission";
import { Role } from "../entities/Role";
import { IRoleCreate } from "../interfaces/IRoleCreate";
import { IRole } from "../interfaces/IRole";
import { PermissionModel } from "./PermissionModel";

@injectable()
export class RoleModel extends Model<Role, IRoleCreate> implements IRole {
    name: string;
    id!: number;
    permissions!: Permission[]
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
        permissions: Association<RoleModel, PermissionModel>
    }

}