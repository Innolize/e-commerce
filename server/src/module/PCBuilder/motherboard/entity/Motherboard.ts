import { CPU_BRANDS, RAM_VERSION, SIZE, VIDEO_CARD_VERSION } from '../../../../config/constants/pcbuilder'
import { Product } from '../../../product/entity/Product'

export class Motherboard {
    static readonly modelName = 'Motherboard'
    constructor(
        public cpu_socket: string,
        public cpu_brand: typeof CPU_BRANDS[number],
        public ram_version: typeof RAM_VERSION[number],
        public min_frec: number,
        public max_frec: number,
        public video_socket: typeof VIDEO_CARD_VERSION[number],
        public model_size: typeof SIZE[number],
        public watts: number,
        public id_product: number,
        public id?: number,
        public product?: Product
    ) { }
}