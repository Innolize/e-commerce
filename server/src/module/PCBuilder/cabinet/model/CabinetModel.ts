import { Association, DataTypes, Model, Sequelize } from 'sequelize'
import { injectable } from "inversify";
import { ProductModel } from "../../../product/module";
import { Cabinet } from '../entities/Cabinet'
import { ICabinetCreate } from '../interface/ICabinetCreate'
import { SIZE } from '../../../../config/constants/pcbuilder';
import { ICabinet } from '../interface/ICabinet';
import { Product } from '../../../product/entity/Product';

@injectable()
export class CabinetModel extends Model<Cabinet, ICabinetCreate> implements ICabinet {

    size: typeof SIZE[number]
    generic_pws: boolean;
    id_product: number;
    id?: number | undefined;
    product?: Product | undefined;

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
            },
            id_product: {
                type: DataTypes.INTEGER,
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
    public static associations: {
        product: Association<CabinetModel, ProductModel>
    }
}