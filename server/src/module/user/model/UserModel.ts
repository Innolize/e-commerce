import { injectable } from "inversify"
import { DataTypes, Model, Sequelize } from "sequelize"
import { Roles } from "../../../config/constants/roles"
import { User } from "../entities/User"
import { IUserCreate } from "../interfaces/IUserCreate"

@injectable()
export class UserModel extends Model<User, IUserCreate>{
    static setup(database: Sequelize): typeof UserModel {
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
                type: DataTypes.ENUM(...Object.keys(Roles)),
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
        return UserModel
    }
}