import { VIDEO_CARD_VERSION } from "../../../../config/constants/pcbuilder";

export interface IVideoCardGetAllQuery {
    limit?: number,
    offset?: number,
    version?: typeof VIDEO_CARD_VERSION[number]
}