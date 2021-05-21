import { FullUser, IFullUserCreate } from "../entities/FullUser"
import { User } from "../entities/User"
import { IUserCreate } from "../interfaces/IUserCreate"
import { UserModel } from "../model/UserModel"

export const fromDbToUser = (model: UserModel): User => {
    const user = new User(model.toJSON() as IUserCreate)
    return user
}

export const fromDbToFullUser = (model: UserModel): FullUser => {
    const fullUser = new FullUser(model.toJSON() as IFullUserCreate)
    return fullUser
}