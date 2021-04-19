import { DataTypes, Model, Sequelize } from "sequelize"
import { Roles } from "../../../config/constants/roles"
import { User } from "../entities/User"
import { IUserCreate } from "../interfaces/IUserCreate"

export class UserModel extends Model<User, IUserCreate>{
    static setup(database: Sequelize): UserModel {
        UserModel.init({
            mail: {
                type: DataTypes.STRING,
                allowNull: false
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            role: {
                type: DataTypes.ENUM(Roles),
                allowNull: false
            }
        },
            {
                sequelize: database,
                modelName: "User",
                createdAt: "creadoEn",
                updatedAt: "modificadoEn"
            }
        )
    }
}