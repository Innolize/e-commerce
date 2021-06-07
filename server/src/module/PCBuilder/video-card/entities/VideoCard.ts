import { VIDEO_CARD_VERSION } from '../../../../config/constants/pcbuilder'
import { Product } from '../../../product/entity/Product'

export class VideoCard {
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