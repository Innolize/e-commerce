import { Association, DataTypes, Model, Sequelize } from 'sequelize'
import { injectable } from "inversify";
import { ProductModel } from "../../../product/module";
import { Ram } from '../entities/Ram'
import { IRamCreate } from '../interface/IRamCreate'
import { RAM_VERSION } from '../../../../config/constants/pcbuilder';

@injectable()
export class RamModel extends Model<Ram, IRamCreate>{
    static setup(database: Sequelize): typeof RamModel {
        RamModel.init({
            id: {
                primaryKey: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true
            },
            ram_version: {
                type: DataTypes.ENUM(...RAM_VERSION),
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
            watts: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            memory: {
                type: DataTypes.INTEGER(),
                allowNull: false
            }
        }, {
            sequelize: database,
            modelName: "Ram"
        })
        return RamModel
    }
    static setupProductAssociation(model: typeof ProductModel): void {
        RamModel.belongsTo(model, {
            as: "product",
            onDelete: 'cascade',
            foreignKey: {
                name: "id_product",
                allowNull: false,
            },
        })
    }

    static associations: {
        product: Association<RamModel, ProductModel>
    }
}