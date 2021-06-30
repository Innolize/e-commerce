import { DataTypes, Model, Sequelize } from "sequelize/types";
import { Order } from "../entities/Order";
import { IOrder, IPayment } from "../interfaces/IOrder";
import { IOrderCreate } from "../interfaces/IOrderCreate";
import { IOrderItem } from "../interfaces/IOrderItem";

export class OrderModel extends Model<Order, IOrderCreate> implements IOrder {
    public id!: number;
    public user_id!: number;
    public payment_id!: number;
    public cartItems?: IOrderItem[];
    public payment?: IPayment;

    static setup(database: Sequelize): typeof OrderModel {
        OrderModel.init({
            id: {
                type: DataTypes.INTEGER,
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
        },{
            sequelize: database,
            modelName: 'Order'
        })
        return OrderModel
    }

}