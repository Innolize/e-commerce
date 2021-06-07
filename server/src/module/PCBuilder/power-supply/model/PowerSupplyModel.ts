import { Association, DataTypes, Model, Sequelize } from 'sequelize'
import { injectable } from "inversify";
import { ProductModel } from "../../../product/module";
import { PowerSupply } from '../entities/PowerSupply'
import { IPowerSupplyCreate } from '../interface/IPowerSupplyCreate'
import { PWS_CERTIFICATION } from '../../../../config/constants/pcbuilder';

@injectable()
export class PowerSupplyModel extends Model<PowerSupply, IPowerSupplyCreate>{
    static setup(database: Sequelize): typeof PowerSupplyModel {
        PowerSupplyModel.init({
            id: {
                primaryKey: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true
            },
            certification: {
                type: DataTypes.ENUM(...PWS_CERTIFICATION),
                defaultValue: "GENERIC"
            },
            watts: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        }
            , {
                sequelize: database,
                modelName: "PowerSupply"
            })
        return PowerSupplyModel
    }
    static setupProductAssociation(model: typeof ProductModel): void {
        PowerSupplyModel.belongsTo(model, {
            as: "product",
            onDelete: 'cascade',
            foreignKey: {
                name: "id_product",
                allowNull: false,
            },
        })
    }
    static associations: {
        product: Association<PowerSupplyModel, ProductModel>
    }
}