import { DataTypes, Model, Sequelize, Association } from "sequelize";
import { PAYMENT_STATUS, PAYMENT_TYPE } from "../../../config/constants/pcbuilder";
import { Order } from "../../order/entities/Order";
import { OrderModel } from "../../order/module";
import { Payment } from "../entities/Payment";
import { IPayment } from "../interfaces/IPayment";
import { IPaymentCreate } from "../interfaces/IPaymentCreate";

export class PaymentModel extends Model<Payment, IPaymentCreate> implements IPayment {
    id: number;
    order_id: number;
    status: typeof PAYMENT_STATUS[number];
    type: typeof PAYMENT_TYPE[number];
    amount: number;
    order: Order;

    static setup(database: Sequelize): typeof PaymentModel {
        PaymentModel.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            order_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            amount: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            status: {
                type: DataTypes.ENUM(...PAYMENT_STATUS),
                defaultValue: PAYMENT_STATUS[1],
                allowNull: false
            },
            type: {
                type: DataTypes.ENUM(...PAYMENT_TYPE),
                allowNull: false
            }
        }, {
            sequelize: database
        })
        return PaymentModel
    }

    static setupOrderAssociation(model: typeof OrderModel): typeof PaymentModel {
        PaymentModel.belongsTo(model, {
            foreignKey: "order_id",
            as: "order"
        })
        return PaymentModel
    }

    static associations: {
        order: Association<PaymentModel, OrderModel>
    }
}