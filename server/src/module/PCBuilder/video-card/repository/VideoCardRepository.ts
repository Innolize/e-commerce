import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractRepository } from "../../../abstractClasses/abstractRepository";
import { Sequelize, WhereOptions } from "sequelize";
import { ProductModel } from "../../../product/module";
import { Product } from "../../../product/entity/Product";
import { VideoCardModel } from "../model/VideoCardModel";
import { fromDbToVideoCard, fromRequestToVideoCard } from "../mapper/videoCardMapper";
import { VideoCard } from "../entities/VideoCard";
import { VideoCardError } from "../error/VideoCardError";
import { GetVideoCardsReqDto } from "../dto/getVideoCardsReqDto";
import { GetVideoCardsDto } from "../dto/getVideoCardsDto";

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

    async getVideoCards(queryParams: GetVideoCardsReqDto): Promise<GetVideoCardsDto> {
        const { limit, offset, version } = queryParams
        const whereOptions: WhereOptions<VideoCard> = {}
        version ? whereOptions.version = version : ''
        const { count, rows } = await this.videoCardModel.findAndCountAll({ where: whereOptions, limit, offset, include: { association: VideoCardModel.associations.product, include: [{ association: ProductModel.associations.brand }, { association: ProductModel.associations.category }] } });
        const videoCards = rows.map(fromDbToVideoCard)
        const response = new GetVideoCardsDto(count, videoCards)
        return response
    }

    async getSingleVideoCard(id: number): Promise<VideoCard | Error> {
        const response = await this.videoCardModel.findByPk(id, { include: { association: VideoCardModel.associations.product, include: [{ association: ProductModel.associations.brand }, { association: ProductModel.associations.category }] } })
        if (!response) {
            throw VideoCardError.notFound()
        }
        return fromDbToVideoCard(response)
    }

    async createVideoCard(product: Product, videoCard: VideoCard): Promise<VideoCard | Error> {
        const transaction = await this.ORM.transaction()
        const newProduct = await this.productModel.create(product, { transaction, isNewRecord: true });
        const id_product = newProduct.getDataValue("id") as number
        const newVideoCard = fromRequestToVideoCard({ ...videoCard, id_product })
        const createdVideoCard = await this.videoCardModel.create(newVideoCard, { transaction, isNewRecord: true })
        transaction.commit()
        const response = fromDbToVideoCard(createdVideoCard)
        return response

    }

    async modifyVideoCard(id: number, videoCard: VideoCard): Promise<VideoCard | Error> {
        const [videoCardEdited, videoCardArray] = await this.videoCardModel.update(videoCard, { where: { id }, returning: true })
        // update returns an array, first argument is the number of elements updated in the
        // database. Second argument are the array of elements. Im updating by id so there is only 
        // one element in the array.
        if (!videoCardEdited) {
            throw VideoCardError.notFound()
        }
        const modifiedVideoCard = videoCardArray[0]
        return fromDbToVideoCard(modifiedVideoCard)
    }

    async deleteVideoCard(id: number): Promise<true | Error> {
        const response = await this.videoCardModel.destroy({ where: { id } })
        if (!response) {
            throw VideoCardError.notFound()
        }
        return true
    }
}