import { VIDEO_CARD_VERSION } from '../../../../config/constants/pcbuilder'
import { Product } from '../../../product/entity/Product'
import { IVideoCard } from '../interface/IVideoCard'

export class VideoCard implements IVideoCard {
    static readonly modelName = 'VideoCard'
    constructor(
        public version: typeof VIDEO_CARD_VERSION[number],
        public memory: number,
        public clock_speed: number,
        public watts: number,
        public id_product: number,
        public id?: number,
        public product?: Product
    ) { }
}