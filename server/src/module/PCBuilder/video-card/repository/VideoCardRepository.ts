import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractRepository } from "../../../abstractClasses/abstractRepository";
import { WhereOptions } from "sequelize";
import { ProductModel } from "../../../product/module";
import { VideoCardModel } from "../model/VideoCardModel";
import { fromDbToVideoCard } from "../mapper/videoCardMapper";
import { VideoCard } from "../entities/VideoCard";
import { VideoCardError } from "../error/VideoCardError";
import { GetVideoCardReqDto } from "../dto/getVideoCardReqDto";
import { GetVideoCardDto } from "../dto/getVideoCardDto";
import { IVideoCardRepository } from "../interface/IVideoCardRepository";
import { IVideoCardCreate } from "../interface/IVideoCardCreate";
import { IVideoCardEdit } from "../interface/IVideoCardEdit";

@injectable()
export class VideoCardRepository extends AbstractRepository implements IVideoCardRepository {
    private videoCardModel: typeof VideoCardModel

    constructor(
        @inject(TYPES.PCBuilder.VideoCard.Model) videoCardModel: typeof VideoCardModel,
    ) {
        super()
        this.videoCardModel = videoCardModel

    }

    async getAll(queryParams: GetVideoCardReqDto): Promise<GetVideoCardDto> {
        const { limit, offset, version } = queryParams
        const whereOptions: WhereOptions<VideoCard> = {}
        version ? whereOptions.version = version : ''
        const { count, rows } = await this.videoCardModel.findAndCountAll({ where: whereOptions, limit, offset, include: { association: VideoCardModel.associations.product, include: [{ association: ProductModel.associations.brand }, { association: ProductModel.associations.category }] } });
        const videoCards = rows.map(fromDbToVideoCard)
        const response = new GetVideoCardDto(count, videoCards)
        return response
    }

    async getSingle(id: number): Promise<VideoCard> {
        const response = await this.videoCardModel.findByPk(id, { include: { association: VideoCardModel.associations.product, include: [{ association: ProductModel.associations.brand }, { association: ProductModel.associations.category }] } })
        if (!response) {
            throw VideoCardError.notFound()
        }
        return fromDbToVideoCard(response)
    }

    async create(newVideoCard: IVideoCardCreate): Promise<VideoCard> {
        const createdVideoCard = await this.videoCardModel.create(newVideoCard, { include: VideoCardModel.associations.product })
        const response = fromDbToVideoCard(createdVideoCard)
        return response

    }

    async modify(id: number, videoCard: IVideoCardEdit): Promise<VideoCard> {
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

    async delete(id: number): Promise<true> {
        const response = await this.videoCardModel.destroy({ where: { id } })
        if (!response) {
            throw VideoCardError.notFound()
        }
        return true
    }
}