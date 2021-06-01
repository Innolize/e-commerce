import { Role } from "../../authorization/entities/Role"
import { User } from "../entities/User"
import { IUserCreate } from "../interfaces/IUserCreate"
import { UserModel } from "../model/UserModel"

export const fromDbToUser = (model: UserModel): User => {
    const user = model.toJSON() as User
    const { mail, id, password, role_id, role } = user
    const userRole = role ? new Role(role) : undefined
    return new User(mail, password, role_id, id, userRole)
}

export const fromRequestToUser = (request: IUserCreate): User => {
    const { mail, role_id, password, id } = request
    return new User(mail, password, role_id, id || undefined)
}