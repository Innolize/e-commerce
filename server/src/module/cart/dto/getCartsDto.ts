import { Cart } from "../entities/Cart";

export class GetCartsDto {
    constructor(
        public count: number,
        public results: Cart[]
    ) { }
}