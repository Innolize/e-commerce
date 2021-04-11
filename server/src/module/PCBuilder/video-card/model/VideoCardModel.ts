import { DataTypes, Model, Sequelize } from 'sequelize'
import { injectable } from "inversify";
import { ProductModel } from "../../../product/module";
import { VideoCard } from '../entities/VideoCard'
import { IVideoCardCreate } from '../interface/IVideoCardCreate'
import { VIDEO_CARD_VERSION } from '../../../../config/constants/pcbuilder';

@injectable()
export class VideoCardModel extends Model<VideoCard, IVideoCardCreate>{
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
}