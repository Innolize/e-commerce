import { Product } from '../../../product/entity/Product'

export class Processor {
    static readonly modelName = 'Processor'
    constructor(
        public cores: number,
        public frecuency: number,
        public socket: number,
        public watts: number,
        public id?: number,
        public id_product?: number,
        public product?: Product
    ) {}
}