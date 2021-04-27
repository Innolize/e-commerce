import { Roles } from "../../../config/constants/roles"
import { IUserCreate } from "../interfaces/IUserCreate"

export class User {
    id?: number
    mail: string
    password: string
    role_id: number
    constructor({ id, mail, password, role_id }: IUserCreate) {
        if (id) {
            this.id = id
        }
        this.mail = mail
        this.password = password
        this.role_id = role_id
    }
}