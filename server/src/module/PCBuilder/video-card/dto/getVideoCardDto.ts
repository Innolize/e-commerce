import { VideoCard } from "../entities/VideoCard";

export class GetVideoCardDto {
    constructor(
        public count: number,
        public results: VideoCard[]
    ) { }
}