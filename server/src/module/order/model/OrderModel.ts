import { injectable } from "inversify";
import { Association, DataTypes, Model, Sequelize } from "sequelize";
import { UserModel } from "../../user/module";
import { Order } from "../entities/Order";
import { IOrder, IPayment } from "../interfaces/IOrder";
import { IOrderCreate } from "../interfaces/IOrderCreate";
import { IOrderItem } from "../interfaces/IOrderItem";
import { OrderItemModel } from "./OrderItemModel";

@injectable()
export class OrderModel extends Model<Order, IOrderCreate> implements IOrder {
    public id!: number;
    public user_id!: number;
    public payment_id!: number;
    public orderItems?: IOrderItem[];
    public payment?: IPayment;

    static setup(database: Sequelize): typeof OrderModel {
        OrderModel.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            payment_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        }, {
            sequelize: database,
            modelName: 'Order'
        })
        return OrderModel
    }

    static setupOrderItemAssociation(model: typeof OrderItemModel): typeof OrderItemModel {
        OrderModel.hasMany(model, {
            foreignKey: "order_id",
            as:"orderItems"
        })
        return OrderItemModel
    }

    static setupUserAssociation(model: typeof UserModel): typeof OrderItemModel {
        OrderModel.belongsTo(model, {
            foreignKey: "user_id",
            as: 'user'
        })
        return OrderItemModel
    }

    public static associations: {
        orderItems: Association<OrderModel, OrderItemModel>;
        user: Association<OrderModel, UserModel>;
    };
}