import { Association, DataTypes, Model, Sequelize } from 'sequelize'
import { injectable } from "inversify";
import { ProductModel } from "../../../product/module";
import { IProcessorCreate } from '../interface/IProcessorCreate'
import { Processor } from '../entities/Processor';
import { IProcessor } from '../interface/IProcessor';
import { Product } from '../../../product/entity/Product';

@injectable()
export class ProcessorModel extends Model<Processor, IProcessorCreate> implements IProcessor {

    public cores!: number;
    public frecuency!: number;
    public socket!: string;
    public watts!: number;
    public id_product!: number;
    public id!: number;
    public product?: Product;

    static setup(database: Sequelize): typeof ProcessorModel {
        ProcessorModel.init({
            id: {
                primaryKey: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true
            },
            watts: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            cores: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            frecuency: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            socket: {
                type: DataTypes.STRING,
                allowNull: false
            },
            id_product: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        }, {
            sequelize: database,
            modelName: "Processor"
        })
        return ProcessorModel
    }
    static setupProductAssociation(model: typeof ProductModel): void {
        ProcessorModel.belongsTo(model, {
            as: "product",
            onDelete: 'cascade',
            foreignKey: {
                name: "id_product",
                allowNull: false,
            },
        })
    }

    static addProcessorHookOnDelete(productModel: typeof ProductModel): void {
        productModel.addHook('afterDestroy', 'processorHookOnDelete',
            async (instance: ProductModel) => {
                const processor = await instance.getProcessor()
                if (processor) {
                    await processor.destroy()
                    console.log(`Processor associated with product ${instance.id} deleted`)
                }
            })
    }

    static associations: {
        product: Association<ProcessorModel, ProductModel>
    }
}