import { DataTypes, Model, Sequelize } from 'sequelize'
import { injectable } from "inversify";
import { ProductModel } from "../../../product/module";
import { Cabinet } from '../entities/Cabinet'
import { ICabinetCreate } from '../interface/ICabinetCreate'
import { SIZE } from '../../../../config/constants/pcbuilder';

@injectable()
export class CabinetModel extends Model<Cabinet, ICabinetCreate>{
    static setup(database: Sequelize): typeof CabinetModel {
        CabinetModel.init({
            id: {
                primaryKey: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true
            },
            generic_pws: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            size: {
                type: DataTypes.ENUM(...SIZE),
                allowNull: false
            }
        }, {
            sequelize: database,
            modelName: "Cabinet"
        })
        return CabinetModel
    }
    static setupProductAssociation(model: typeof ProductModel): void {
        CabinetModel.belongsTo(model, {
            as: "product",
            onDelete: 'cascade',
            foreignKey: {
                name: "id_product",
                allowNull: false,
            },
        })
    }
}