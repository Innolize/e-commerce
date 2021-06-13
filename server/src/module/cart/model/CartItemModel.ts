import { Association, DataTypes, Model, Sequelize } from "sequelize";
import { Product } from "../../product/entity/Product";
import { ProductModel } from "../../product/module";
import { CartItem } from "../entities/CartItem";
import { ICartItem } from "../interface/ICartItem";
import { ICartItemCreate } from "../interface/ICartItemCreate";
import { CartModel } from "./CartModel";

export class CartItemModel extends Model<CartItem, ICartItemCreate> implements ICartItem {
    product_id: number;
    quantity: number;
    cart_id: number;
    id?: number | undefined;
    product?: Product | undefined;

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

    static setupProductAssociation(model: typeof ProductModel): typeof CartItemModel {
        CartItemModel.belongsTo(model, {
            as: 'product',
            foreignKey: 'id'
        })
        return CartItemModel
    }

    static setupCartAssociation(model: typeof CartModel): typeof CartItemModel {
        CartItemModel.belongsTo(model, {
            as: 'cart',
            foreignKey: "id"
        })
        return CartItemModel
    }

    static associations: {
        cart: Association<CartItemModel, CartModel>,
        product: Association<CartItemModel, ProductModel>
    }
}