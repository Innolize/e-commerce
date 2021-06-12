import { injectable } from "inversify";
import { HasManyCreateAssociationMixin, HasManyGetAssociationsMixin } from "sequelize";
import { Association, DataTypes, Model, Sequelize } from "sequelize";
import { UserModel } from "../../user/module";
import { Cart } from "../entities/Cart";
import { ICartCreate } from "../interface/ICartCreate";
import { CartItemModel } from "./CartItemModel";

@injectable()
export class CartModel extends Model<Cart, ICartCreate>{
    static setup(database: Sequelize): typeof CartModel {
        CartModel.init({
            active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
            {
                sequelize: database,
                modelName: 'Cart'
            }
        )
        return CartModel
    }

    public getCartItems!: HasManyGetAssociationsMixin<CartItemModel>
    public createCartItem!: HasManyCreateAssociationMixin<CartItemModel>

    static setupCartItemAssociation(model: typeof CartItemModel): void {
        CartModel.hasMany(model, {
            as: 'cartItems',
            foreignKey: "cart_id"
        })
    }

    static setupUserAssociation(model: typeof UserModel): void {
        CartModel.belongsTo(model, {
            as: 'user',
            foreignKey: "user_id"
        })
    }

    static associations: {
        cartItems: Association<CartItemModel, CartModel>,
        user: Association<UserModel, CartModel>
    }
}