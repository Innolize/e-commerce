import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractRepository } from "../../abstractClasses/abstractRepository";
import { User } from "../entities/User";
import { fromDbToUser } from "../mapper/userMapper";
import { UserModel } from "../model/UserModel";

@injectable()
export class UserRepository extends AbstractRepository {
    private userModel: typeof UserModel
    constructor(
        @inject(TYPES.User.Model) userModel: typeof UserModel
    ) {
        super()
        this.userModel = userModel
    }

    async getUsers(): Promise<User[]> {
        const users = await this.userModel.findAll()
        return users.map(fromDbToUser)
    }

    async getSingleUser(id: string): Promise<User | Error> {
        try {
            const user = await this.userModel.findByPk(id)
            if (!user) {
                throw Error("User not found")
            }
            return fromDbToUser(user)
        } catch (err) {
            throw Error(err.message)
        }
    }

    async createUser(user: User): Promise<User | Error> {
        try {
            const newUser = await this.userModel.create(user)
            return fromDbToUser(newUser)
        } catch (err) {
            throw Error(err.message)
        }
    }

    async deleteUser(id: number): Promise<true | Error> {
        try {
            const response = await this.userModel.destroy({ where: { id } })
            if (!response) {
                throw Error("User doesn't exists")
            }
            return true
        } catch (err) {
            throw Error(err.message)
        }
    }

}