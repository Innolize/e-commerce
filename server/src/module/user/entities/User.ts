import { Roles } from "../../../config/constants/roles"
import { IUserCreate } from "../interfaces/IUserCreate"

export class User {
    mail: string
    password: string
    role: Roles
    constructor({ mail, password, role }: IUserCreate) {
        this.mail = mail
        this.password = password
        role ? this.role = role : this.role = Roles.client
    }
}