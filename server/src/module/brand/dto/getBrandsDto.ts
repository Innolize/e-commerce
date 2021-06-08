import { Brand } from "../entity/Brand"

export class GetBrandsDto {
    constructor(
        public count: number,
        public results: Brand[]
    ) { }
}