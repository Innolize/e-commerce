import { User } from "../entities/User"
import { IUserCreate } from "../interfaces/IUserCreate"
import { UserModel } from "../model/UserModel"

export const fromDbToUser = (model: UserModel): User => {
    const user = new User(model.toJSON() as IUserCreate)
    return user
}