import { Processor } from "../entities/Processor";

export class GetProcessorDto {
    constructor(
        public count: number,
        public results: Processor[]
    ) { }
}