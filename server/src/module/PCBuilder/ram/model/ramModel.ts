import { Association, DataTypes, Model, Sequelize } from 'sequelize'
import { injectable } from "inversify";
import { ProductModel } from "../../../product/module";
import { Ram } from '../entities/Ram'
import { IRamCreate } from '../interface/IRamCreate'
import { RAM_VERSION } from '../../../../config/constants/pcbuilder';
import { IRam } from '../interface/IRam';
import { Product } from '../../../product/entity/Product';

@injectable()
export class RamModel extends Model<Ram, IRamCreate> implements IRam {
    public ram_version!: typeof RAM_VERSION[number]
    public memory!: number
    public min_frec!: number
    public max_frec!: number
    public watts!: number
    public id_product!: number
    public id!: number
    public product?: Product
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
            },
            id_product: {
                type: DataTypes.INTEGER,
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

    static addRamHookOnDelete(productModel: typeof ProductModel): void {
        productModel.addHook('afterDestroy', 'ramHookOnDelete',
            async (instance: ProductModel) => {
                const ram = await instance.getRam()
                if (ram) {
                    await ram.destroy()
                    console.log(`Ram associated with product ${instance.id} deleted`)
                }
            })
    }

    static associations: {
        product: Association<RamModel, ProductModel>
    }
}