import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractRepository } from "../../../abstractClasses/abstractRepository";
import { Sequelize } from "sequelize";
import { ProductModel } from "../../../product/module";
import { Product } from "../../../product/entity/Product";
import { VideoCardModel } from "../model/VideoCardModel";
import { fromDbToVideoCard, fromRequestToVideoCard } from "../mapper/videoCardMapper";
import { IVideoCardQuery } from "../interface/IVideoCardQuery";
import { VideoCard } from "../entities/VideoCard";
import { VideoCardError } from "../error/VideoCardError";

@injectable()
export class VideoCardRepository extends AbstractRepository {
    private videoCardModel: typeof VideoCardModel
    private productModel: typeof ProductModel
    private ORM: Sequelize

    constructor(
        @inject(TYPES.PCBuilder.VideoCard.Model) videoCardModel: typeof VideoCardModel,
        @inject(TYPES.Common.Database) ORM: Sequelize,
        @inject(TYPES.Product.Model) productModel: typeof ProductModel
    ) {
        super()
        this.videoCardModel = videoCardModel
        this.productModel = productModel
        this.ORM = ORM
    }

    async getVideoCards(query?: IVideoCardQuery): Promise<VideoCard[]> {
        const queryParams: IVideoCardQuery = {}
        if (query?.version) {
            queryParams.version = query.version
        }
        const response = await this.videoCardModel.findAll({ where: queryParams, include: VideoCardModel.associations.product });
        return response.map(fromDbToVideoCard)
    }

    async getSingleVideoCard(id: number): Promise<VideoCard | Error> {
        try {
            const response = await this.videoCardModel.findByPk(id, { include: VideoCardModel.associations.product })
            if (!response) {
                throw VideoCardError.notFound()
            }
            return fromDbToVideoCard(response)
        } catch (err) {
            throw err
        }


    }

    async createVideoCard(product: Product, videoCard: VideoCard): Promise<VideoCard | Error> {
        const transaction = await this.ORM.transaction()
        try {
            const newProduct = await this.productModel.create(product, { transaction, isNewRecord: true });
            const id_product = newProduct.getDataValue("id")
            const newVideoCard = fromRequestToVideoCard({ ...videoCard, id_product })
            const createdVideoCard = await this.videoCardModel.create(newVideoCard, { transaction, isNewRecord: true })
            transaction.commit()
            const response = fromDbToVideoCard(createdVideoCard)
            return response
        } catch (err) {
            throw err
        }
    }

    async modifyVideoCard(id: number, videoCard: VideoCard): Promise<VideoCard | Error> {
        try {
            const [videoCardEdited, videoCardArray] = await this.videoCardModel.update(videoCard, { where: { id }, returning: true })
            // update returns an array, first argument is the number of elements updated in the
            // database. Second argument are the array of elements. Im updating by id so there is only 
            // one element in the array.
            if (!videoCardEdited) {
                throw VideoCardError.notFound()
            }
            const modifiedVideoCard = videoCardArray[0]
            return fromDbToVideoCard(modifiedVideoCard)
        } catch (err) {
            throw err
        }
    }

    async deleteVideoCard(id: number): Promise<true | Error> {
        try {
            const response = await this.videoCardModel.destroy({ where: { id } })
            if (!response) {
                throw VideoCardError.notFound()
            }
            return true
        } catch (err) {
            throw err
        }
    }
}