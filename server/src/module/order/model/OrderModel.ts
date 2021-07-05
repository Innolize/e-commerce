import { injectable } from "inversify";
import { Association, DataTypes, Model, Sequelize } from "sequelize";
import { IPayment } from "../../payment/interfaces/IPayment";
import { PaymentModel } from "../../payment/models/PaymentModel";
import { UserModel } from "../../user/module";
import { Order } from "../entities/Order";
import { IOrder } from "../interfaces/IOrder";
import { IOrderCreate } from "../interfaces/IOrderCreate";
import { IOrderItem } from "../interfaces/IOrderItem";
import { OrderItemModel } from "./OrderItemModel";

@injectable()
export class OrderModel extends Model<Order, IOrderCreate> implements IOrder {
    public id!: number;
    public user_id!: number;
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

    static setupOrderItemAssociation(model: typeof OrderItemModel): typeof OrderModel {
        OrderModel.hasMany(model, {
            foreignKey: "order_id",
            as: "orderItems"
        })
        return OrderModel
    }

    static setupUserAssociation(model: typeof UserModel): typeof OrderModel {
        OrderModel.belongsTo(model, {
            foreignKey: "user_id",
            as: 'user'
        })
        return OrderModel
    }

    static setupPaymentAssociation(model: typeof PaymentModel): typeof OrderModel {
        OrderModel.hasOne(model, {
            foreignKey: "order_id",
            as: "payment"
        })
        return OrderModel
    }

    public static associations: {
        orderItems: Association<OrderModel, OrderItemModel>;
        user: Association<OrderModel, UserModel>;
        payment: Association<OrderModel, PaymentModel>;
    };
}