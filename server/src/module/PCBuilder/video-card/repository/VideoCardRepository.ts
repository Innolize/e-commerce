import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractRepository } from "../../../abstractClasses/abstractRepository";
import { Sequelize } from "sequelize";
import { ProductModel } from "../../../product/module";
import { Product } from "../../../product/entity/Product";
import { FullVideoCard } from "../entities/FullVideoCard";
import { VideoCardModel } from "../model/VideoCardModel";
import { fromDbToFullVideoCard, fromDbToVideoCard } from "../mapper/videoCardMapper";
import { IVideoCardQuery } from "../interface/IVideoCardQuery";
import { VideoCard } from "../entities/VideoCard";

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

    async getRams(query?: IVideoCardQuery): Promise<FullVideoCard[]> {
        const queryParams: IVideoCardQuery = {}
        if (query?.version) {
            queryParams.version = query.version
        }
        const response = await this.videoCardModel.findAll({ where: queryParams, include: "product" });
        return response.map(fromDbToFullVideoCard)
    }

    async getSingleRam(id: number): Promise<FullVideoCard | Error> {
        try {
            const response = await this.videoCardModel.findByPk(id, { include: 'product' })
            if (!response) {
                throw new Error('Video card not found')
            }
            const ram = fromDbToFullVideoCard(response)
            return ram
        } catch (err) {
            throw new Error(err.message)
        }


    }

    async createRam(product: Product, videoCard: VideoCard): Promise<FullVideoCard | Error> {
        const transaction = await this.ORM.transaction()
        try {
            const newProduct = await this.productModel.create(product, { transaction, isNewRecord: true });
            const id_product = newProduct.getDataValue("id")
            const newRam = new VideoCard({ ...videoCard, id_product })
            const createdRam = await this.videoCardModel.create(newRam, { transaction, isNewRecord: true, include: "product" })
            transaction.commit()
            const response = fromDbToFullVideoCard(createdRam)
            return response
        } catch (err) {
            throw new Error(err.message)
        }
    }

    async modifyRam(id: number, videoCard: VideoCard): Promise<VideoCard | Error> {
        try {
            const [videoCardEdited, videoCardArray] = await this.videoCardModel.update(videoCard, { where: { id }, returning: true })
            // update returns an array, first argument is the number of elements updated in the
            // database. Second argument are the array of elements. Im updating by id so there is only 
            // one element in the array.
            if (!videoCardEdited) {
                throw new Error('Video card not found')
            }
            const modifiedVideoCard = videoCardArray[0]
            return fromDbToVideoCard(modifiedVideoCard)
        } catch (err) {
            throw new Error(err.message)
        }
    }

    async deleteRam(id: number): Promise<true | Error> {

        try {
            const response = await this.videoCardModel.destroy({ where: { id } })
            if (!response) {
                throw new Error('Video card not found')
            }
            return true
        } catch (err) {
            throw new Error(err.message)
        }
    }
}