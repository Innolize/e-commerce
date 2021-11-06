import { Association, DataTypes, Model, Sequelize } from 'sequelize'
import { injectable } from "inversify";
import { ProductModel } from "../../../product/module";
import { Motherboard } from '../entity/Motherboard'
import { IMotherboardCreate } from '../interface/IMotherboardCreate';
import { RAM_VERSION, CPU_BRANDS, SIZE, VIDEO_CARD_VERSION } from '../../../../config/constants/pcbuilder';
import { IMotherboard } from '../interface/IMotherboard';
import { Product } from '../../../product/entity/Product';

@injectable()
export class MotherboardModel extends Model<Motherboard, IMotherboardCreate> implements IMotherboard{
    public cpu_socket!: string
    public cpu_brand!: typeof CPU_BRANDS[number]
    public ram_version!: typeof RAM_VERSION[number]
    public min_frec!: number
    public max_frec!: number
    public video_socket!: typeof VIDEO_CARD_VERSION[number]
    public model_size!: typeof SIZE[number]
    public watts!: number
    public id_product!: number
    public id!: number
    public product?: Product | undefined;
    
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
                type: DataTypes.ENUM(...CPU_BRANDS),
                allowNull: false
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
            video_socket: {
                type: DataTypes.ENUM(...VIDEO_CARD_VERSION),
                allowNull: false
            },
            model_size: {
                type: DataTypes.ENUM(...SIZE),
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

    static addMotherboardHookOnDelete(productModel: typeof ProductModel):void {
        productModel.addHook('afterDestroy', 'motherboardHookOnDelete',
            async (instance: ProductModel) => {
                const motherboard = await instance.getMotherboard()
                if (motherboard) {
                    await motherboard.destroy()
                    console.log(`Motherboard associated with product ${instance.id} deleted`)
                }
            })
    }
    public static associations: {
        product: Association<MotherboardModel, ProductModel>
    }
}