import { injectable } from "inversify";
import { Association, DataTypes, Model, Sequelize } from "sequelize";
import { Product } from "../../product/entity/Product";
import { ProductModel } from "../../product/module";
import { OrderItem } from "../entities/OrderItem";
import { IOrderItem } from "../interfaces/IOrderItem";
import { IOrderItemCreate } from "../interfaces/IOrderItemCreate";
import { OrderModel } from "./OrderModel";

@injectable()
export class OrderItemModel extends Model<OrderItem, IOrderItemCreate> implements IOrderItem {
    id!: number;
    order_id: number;
    product_id!: number;
    quantity!: number;
    price_per_unit!: number;
    total!: number;
    product?: Product;
    
    static setup(database: Sequelize): typeof OrderItemModel {
        OrderItemModel.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            product_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            order_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            price_per_unit: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            total: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        }, {
            sequelize: database,
            modelName: 'OrderItem'
        })
        return OrderItemModel
    }
    static setupOrderAssociation(model: typeof OrderModel): typeof OrderItemModel {
        OrderItemModel.belongsTo(model, {
            foreignKey: "order_id",
            as: 'order'
        })
        return OrderItemModel
    }

    static setupProductAssociation(model: typeof ProductModel): typeof OrderItemModel {
        OrderItemModel.belongsTo(model, {
            foreignKey: "product_id",
            as: 'product'
        })
        return OrderItemModel
    }

    public static associations: {
        order: Association<OrderItemModel, OrderModel>;
        product: Association<OrderItemModel, ProductModel>;
    };
}