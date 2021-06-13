export class GetUserReqDto {
    constructor(
        public limit: number = 20,
        public offset: number = 0
    ) { }
}