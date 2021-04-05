import { DataTypes, Model, Sequelize } from 'sequelize'
import { injectable } from "inversify";
import { ProductModel } from "../../../product/module";
import { Motherboard } from '../entity/Motherboard'
import { IMotherboardCreate } from '../interface/IMotherboardCreate';

@injectable()
export class MotherboardModel extends Model<Motherboard, IMotherboardCreate>{
    static setup(database: Sequelize): typeof MotherboardModel {
        MotherboardModel.init({
            id: {
                primaryKey: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true
            },
            cpu_socket: {
                type: DataTypes.STRING,
                allowNull: false
            },
            cpu_brand: {
                type: DataTypes.ENUM("AMD", "INTEL"),
                allowNull: false
            },
            ram_version: {
                type: DataTypes.ENUM("DDR1", "DDR2", "DDR3", "DDR4"),
                allowNull: false
            },
            min_frec: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            max_frec: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            video_socket: {
                type: DataTypes.STRING,
                allowNull: false
            },
            model_size: {
                type: DataTypes.ENUM("ATX", "Micro-ATX", "Mini-ATX"),
                allowNull: false
            },
            watts: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
        }, {
            sequelize: database,
            modelName: "Motherboard"
        })
        return MotherboardModel
    }
    static setupProductAssociation(model: typeof ProductModel): void {
        MotherboardModel.belongsTo(model, {
            as: "product",
            onDelete: 'cascade',
            foreignKey: {
                name: "id_product",
                allowNull: false,
            },
        })
    }
}