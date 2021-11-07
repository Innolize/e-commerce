import { GetVideoCardDto } from "../dto/getVideoCardDto";
import { GetVideoCardReqDto } from "../dto/getVideoCardReqDto";
import { VideoCard } from "../entities/VideoCard";
import { IVideoCardCreate } from "./IVideoCardCreate";
import { IVideoCardEdit } from "./IVideoCardEdit";

export interface IVideoCardService {
    getAll: (queryParams: GetVideoCardReqDto) => Promise<GetVideoCardDto>
    getSingle: (id: number) => Promise<VideoCard>
    create: (videoCard: IVideoCardCreate) => Promise<VideoCard>
    modify: (id: number, videoCard: IVideoCardEdit) => Promise<VideoCard>
    delete: (id: number) => Promise<true>
}