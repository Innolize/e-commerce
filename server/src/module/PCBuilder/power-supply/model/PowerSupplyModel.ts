import { Association, DataTypes, Model, Sequelize } from 'sequelize'
import { injectable } from "inversify";
import { ProductModel } from "../../../product/module";
import { PowerSupply } from '../entities/PowerSupply'
import { IPowerSupplyCreate } from '../interface/IPowerSupplyCreate'
import { PWS_CERTIFICATION } from '../../../../config/constants/pcbuilder';
import { IPowerSupply } from '../interface/IPowerSupply';
import { Product } from '../../../product/entity/Product';

@injectable()
export class PowerSupplyModel extends Model<PowerSupply, IPowerSupplyCreate> implements IPowerSupply {
    public watts!: number
    public certification!: typeof PWS_CERTIFICATION[number]
    public id_product!: number
    public id!: number
    public product?: Product

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
            },
            id_product: {
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

    static addPowerSupplyHookOnDelete(productModel: typeof ProductModel): void {
        productModel.addHook('afterDestroy', 'powerSupplyHookOnDelete',
            async (instance: ProductModel) => {
                const powerSupply = await instance.getPowerSupply()
                if (powerSupply) {
                    await powerSupply.destroy()
                    console.log(`Power supply associated with product ${instance.id} deleted`)
                }
            })
    }

    static associations: {
        product: Association<PowerSupplyModel, ProductModel>
    }
}