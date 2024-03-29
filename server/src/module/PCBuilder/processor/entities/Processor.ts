import { Product } from '../../../product/entity/Product'
import { IProcessor } from '../interface/IProcessor'

export class Processor implements IProcessor {
    static readonly modelName = 'Processor'
    constructor(
        public cores: number,
        public frecuency: number,
        public socket: string,
        public watts: number,
        public id_product: number,
        public id?: number,
        public product?: Product
    ) { }
}