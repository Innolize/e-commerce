import { User } from "../entities/User"

export class GetUsersDto {
    constructor(
        public count: number,
        public results: User[]
    ) { }
}