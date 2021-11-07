export class GetProcessorReqDto {
    constructor(
        public limit: number = 20,
        public offset: number = 0,
        public socket?: string
    ) { }
}