import { Roles } from "../../../config/constants/roles"
import { IUserCreate } from "../interfaces/IUserCreate"

export class User {
    id?: string
    mail: string
    password: string
    role: Roles
    constructor({ id, mail, password, role }: IUserCreate) {
        if (id) {
            this.id = id
        }
        this.mail = mail
        this.password = password
        role ? this.role = role : this.role = Roles.client
    }
}