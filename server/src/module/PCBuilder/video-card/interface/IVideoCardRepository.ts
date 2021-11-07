import { GetVideoCardDto } from "../dto/getVideoCardDto";
import { GetVideoCardReqDto } from "../dto/getVideoCardReqDto";
import { VideoCard } from "../entities/VideoCard";
import { IVideoCardCreate } from "./IVideoCardCreate";
import { IVideoCardEdit } from "./IVideoCardEdit";

export interface IVideoCardRepository {
    getAll: (queryParams: GetVideoCardReqDto) => Promise<GetVideoCardDto>
    getSingle: (id: number) => Promise<VideoCard>
    create: (newVideoCard: IVideoCardCreate) => Promise<VideoCard>
    modify: (id: number, videoCard: IVideoCardEdit) => Promise<VideoCard>
    delete: (id: number) => Promise<true>
}