import { HasManyCreateAssociationMixin, HasManyGetAssociationsMixin } from "sequelize";
import { Association, DataTypes, Model, Sequelize } from "sequelize";
import { Cart } from "../entities/Cart";
import { ICartCreate } from "../interface/ICartCreate";
import { CartItemModel } from "./CartItemModel";

export class CartModel extends Model<Cart, ICartCreate>{
    static setup(database: Sequelize): typeof CartModel {
        CartModel.init({
            active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            userId: {
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

    static associations: {
        cartItems: Association<CartItemModel, CartModel>
    }
}