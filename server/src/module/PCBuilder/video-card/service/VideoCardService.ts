import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractService } from "../../../abstractClasses/abstractService";
import { GetVideoCardDto } from "../dto/getVideoCardDto";
import { GetVideoCardReqDto } from "../dto/getVideoCardReqDto";
import { VideoCard } from "../entities/VideoCard";
import { IVideoCardCreate } from "../interface/IVideoCardCreate";
import { IVideoCardEdit } from "../interface/IVideoCardEdit";
import { IVideoCardRepository } from "../interface/IVideoCardRepository";
import { IVideoCardService } from "../interface/IVideoCardService";

@injectable()
export class VideoCardService extends AbstractService implements IVideoCardService {
    private videoCardRepository: IVideoCardRepository
    constructor(
        @inject(TYPES.PCBuilder.VideoCard.Repository) videoCardRepository: IVideoCardRepository
    ) {
        super()
        this.videoCardRepository = videoCardRepository
    }

    async getAll(queryParams: GetVideoCardReqDto): Promise<GetVideoCardDto> {
        return await this.videoCardRepository.getAll(queryParams)
    }

    async getSingle(id: number): Promise<VideoCard> {
        return await this.videoCardRepository.getSingle(id)
    }

    async create(videoCard: IVideoCardCreate): Promise<VideoCard> {
        return await this.videoCardRepository.create(videoCard)
    }

    async modify(id: number, videoCard: IVideoCardEdit): Promise<VideoCard> {
        return await this.videoCardRepository.modify(id, videoCard)
    }
    async delete(id: number): Promise<true> {
        return await this.videoCardRepository.delete(id)
    }
}