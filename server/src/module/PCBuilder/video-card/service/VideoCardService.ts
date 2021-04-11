import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractService } from "../../../abstractClasses/abstractService";
import { Product } from "../../../product/entity/Product";
import { FullVideoCard } from "../entities/FullVideoCard";
import { VideoCard } from "../entities/VideoCard";
import { IVideoCardQuery } from "../interface/IVideoCardQuery";
import { VideoCardRepository } from "../repository/VideoCardRepository";

@injectable()
export class VideoCardService extends AbstractService {
    private videoCardRepository: VideoCardRepository
    constructor(
        @inject(TYPES.PCBuilder.VideoCard.Repository) videoCardRepository: VideoCardRepository
    ) {
        super()
        this.videoCardRepository = videoCardRepository
    }

    async getRams(query?: IVideoCardQuery): Promise<FullVideoCard[]> {
        return await this.videoCardRepository.getRams(query)
    }

    async getSingleRam(id: number): Promise<FullVideoCard | Error> {
        return await this.videoCardRepository.getSingleRam(id)
    }

    async createRam(product: Product, videoCard: VideoCard): Promise<FullVideoCard | Error> {
        return await this.videoCardRepository.createRam(product, videoCard)
    }

    async modifyRam(id: number, videoCard: VideoCard): Promise<VideoCard | Error> {
        return await this.videoCardRepository.modifyRam(id, videoCard)
    }
    async deleteRam(id: number): Promise<true | Error> {
        return await this.videoCardRepository.deleteRam(id)
    }
}