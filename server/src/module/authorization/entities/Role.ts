import { IRole } from "../interfaces/IRole";
import { IRoleName } from "../interfaces/IRole";
import { Permission } from "./Permission"

export class Role implements IRole {
    constructor(
        public name: IRoleName,
        public id?: number,
        public permissions?: Permission[]
    ) { }
}