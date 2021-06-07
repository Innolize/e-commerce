import { VIDEO_CARD_VERSION } from "../../../../config/constants/pcbuilder";

export interface IVideoCardQuery {
    version?: typeof VIDEO_CARD_VERSION[number]
}