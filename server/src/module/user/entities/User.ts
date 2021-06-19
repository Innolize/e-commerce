import { Role } from "../../authorization/entities/Role"
import { Cart } from "../../cart/entities/Cart"

export class User {
    static readonly modelName = 'User'
    constructor(
        public mail: string,
        public password: string,
        public role_id: number,
        public id?: number,
        public cart?: Cart,
        // public orders: Orders[]
        public role?: Role,
    ) { }
}