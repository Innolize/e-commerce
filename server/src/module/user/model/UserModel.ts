import { injectable } from "inversify"
import { Association, DataTypes, HasOneCreateAssociationMixin, Model, Sequelize } from "sequelize"
import { Role } from "../../authorization/entities/Role"
import { RoleModel } from "../../authorization/module"
import { Cart } from "../../cart/entities/Cart"
import { CartModel } from "../../cart/module"
import { User } from "../entities/User"
import { IUser } from "../interfaces/IUser"
import { IUserCreate } from "../interfaces/IUserCreate"

@injectable()
export class UserModel extends Model<User, IUserCreate> implements IUser {
    mail!: string
    password!: string
    role_id!: number
    id!: number
    cart?: Cart
    role?: Role

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

    createCart!: HasOneCreateAssociationMixin<CartModel>

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

    static setupCartAssociation(model: typeof CartModel): typeof UserModel {
        UserModel.hasOne(model, {
            foreignKey: {
                name: "user_id"
            },
            as: 'cart'
        })
        return UserModel
    }

    public static associations: {
        role: Association<UserModel, RoleModel>;
        cart: Association<UserModel, CartModel>;
    };
}