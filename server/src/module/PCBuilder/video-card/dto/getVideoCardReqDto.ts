import { RAM_VERSION, VIDEO_CARD_VERSION } from "../../../../config/constants/pcbuilder";

export class GetVideoCardReqDto {
    constructor(
        public limit: number = 20,
        public offset: number = 0,
        public version?: typeof VIDEO_CARD_VERSION[number]
    ) { }
}