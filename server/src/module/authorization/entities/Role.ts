import { IRole } from "../interfaces/IRole";
import { Permission } from "./Permission"

export class Role implements IRole {
    constructor(
        public name: string,
        public id?: number,
        public permissions?: Permission[]
    ) { }
}