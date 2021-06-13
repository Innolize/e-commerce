import { Association, DataTypes, Model, Sequelize } from 'sequelize'
import { injectable } from "inversify";
import { ProductModel } from "../../../product/module";
import { VideoCard } from '../entities/VideoCard'
import { IVideoCardCreate } from '../interface/IVideoCardCreate'
import { VIDEO_CARD_VERSION } from '../../../../config/constants/pcbuilder';
import { IVideoCard } from '../interface/IVideoCard';
import { Product } from '../../../product/entity/Product';


@injectable()
export class VideoCardModel extends Model<VideoCard, IVideoCardCreate> implements IVideoCard {
    public version!: typeof VIDEO_CARD_VERSION[number]
    public memory!: number
    public clock_speed!: number
    public watts!: number
    public id_product!: number
    public id!: number
    public product?: Product

    static setup(database: Sequelize): typeof VideoCardModel {
        VideoCardModel.init({
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
            memory: {
                type: DataTypes.INTEGER(),
                allowNull: false
            },
            clock_speed: {
                type: DataTypes.INTEGER(),
                allowNull: false
            },
            version: {
                type: DataTypes.ENUM(...VIDEO_CARD_VERSION),
                allowNull: false
            },
            id_product: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        }, {
            sequelize: database,
            modelName: "VideoCard"
        })
        return VideoCardModel
    }
    static setupProductAssociation(model: typeof ProductModel): void {
        VideoCardModel.belongsTo(model, {
            as: "product",
            onDelete: 'cascade',
            foreignKey: {
                name: "id_product",
                allowNull: false,
            },
        })
    }
    static associations: {
        product: Association<VideoCardModel, ProductModel>
    }
}