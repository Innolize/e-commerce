import { Role } from "../../authorization/entities/Role"

export class User {
    static readonly modelName = 'User'
    constructor(
        public mail: string,
        public password: string,
        public role_id: number,
        public id?: number,
        public role?: Role
    ) { }
}