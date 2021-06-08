import { VideoCard } from "../entities/VideoCard";

export class GetVideoCardsDto {
    constructor(
        public count: number,
        public results: VideoCard[]
    ) { }
}