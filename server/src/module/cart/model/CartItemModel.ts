import { Association, DataTypes, Model, Sequelize } from "sequelize";
import { CartItem } from "../entities/CartItem";
import { ICartItemCreate } from "../interface/ICartItemCreate";
import { CartModel } from "./CartModel";

export class CartItemModel extends Model<CartItem, ICartItemCreate>{
    static setup(database: Sequelize): typeof CartItemModel {
        CartItemModel.init({
            cart_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            product_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        }, {
            sequelize: database
        })
        return CartItemModel
    }
    static associations: {
        cart: Association<CartModel, CartItemModel>
    }
}