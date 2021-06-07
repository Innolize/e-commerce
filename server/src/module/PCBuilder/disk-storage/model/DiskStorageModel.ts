import { Association, DataTypes, Model, Sequelize } from 'sequelize'
import { injectable } from "inversify";
import { ProductModel } from "../../../product/module";
import { DiskStorage } from '../entities/DiskStorage'
import { IDiskStorageCreate } from '../interface/IDiskStorageCreate'
import { DISK_TYPE } from '../../../../config/constants/pcbuilder';

@injectable()
export class DiskStorageModel extends Model<DiskStorage, IDiskStorageCreate>{
    static setup(database: Sequelize): typeof DiskStorageModel {
        DiskStorageModel.init({
            id: {
                primaryKey: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true
            },
            mbs: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            total_storage: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            type: {
                type: DataTypes.ENUM(...DISK_TYPE),
                allowNull: false
            },
            watts: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            id_product: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        }, {
            sequelize: database,
            modelName: "DiskStorage"
        })
        return DiskStorageModel
    }
    static setupProductAssociation(model: typeof ProductModel): void {
        DiskStorageModel.belongsTo(model, {
            as: "product",
            onDelete: 'cascade',
            foreignKey: {
                name: "id_product",
                allowNull: false,
            },
        })
    }

    public static associations:{
        product: Association<DiskStorageModel, ProductModel>
    }
}