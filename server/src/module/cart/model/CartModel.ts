import { Association, DataTypes, Model, Sequelize } from "sequelize/types";
import { Cart } from "../entities/Cart";
import { ICartCreate } from "../interface/ICartCreate";
import { CartItemModel } from "./CartItemModel";

export class CartModel extends Model<Cart, ICartCreate>{
    static setup(database: Sequelize): typeof CartModel {
        CartModel.init({
            active: {
                type: DataTypes.BOOLEAN,
                allowNull: false
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

    static setupCartItemAssociation(model: typeof CartItemModel): void {
        CartModel.hasMany(model, {
            as: 'cartItems'
        })
    }

    static associations: {
        cartItems: Association<CartItemModel, CartModel>
    }
}