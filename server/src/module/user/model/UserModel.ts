import { injectable } from "inversify"
import { Association, DataTypes, Model, Sequelize } from "sequelize"
import { RoleModel } from "../../authorization/module"
import { User } from "../entities/User"
import { IUserCreate } from "../interfaces/IUserCreate"

@injectable()
export class UserModel extends Model<User, IUserCreate>{
    static setup(database: Sequelize): typeof UserModel {
        UserModel.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            mail: {
                unique: true,
                type: DataTypes.STRING,
                allowNull: false
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            role_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        },
            {
                sequelize: database,
                modelName: "User",
                createdAt: "creadoEn",
                updatedAt: "modificadoEn"
            }
        )
        return UserModel
    }
    static setupRoleAssociation(model: typeof RoleModel): typeof UserModel {
        UserModel.belongsTo(model, {
            foreignKey: {
                name: "role_id",
                defaultValue: 1
            },
            as: 'role'
        })
        return UserModel
    }

    public static associations: {
        role: Association<UserModel, RoleModel>;
    };
}