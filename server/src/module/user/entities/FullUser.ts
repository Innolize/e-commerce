import { Role } from "../../authorization/entities/Role"

export interface IFullUserCreate {
    id: number
    mail: string
    password: string
    role?: Role
}

export class FullUser {
    id: number
    mail: string
    password: string
    role?: Role
    constructor({ id, mail, password, role}: IFullUserCreate) {
    this.id = id,
        this.mail = mail,
        this.password = password
    if (role) {
        this.role = new Role(role)
    }
}
}