import { inject, injectable } from "inversify";
import { UniqueConstraintError } from "sequelize";
import { TYPES } from "../../../config/inversify.types";
import { AbstractRepository } from "../../abstractClasses/abstractRepository";
import { User } from "../entities/User";
import { IUserEdit } from "../interfaces/IUserEdit";
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

    async getSingleUser(id: number): Promise<User | Error> {
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
            if (err instanceof UniqueConstraintError) {
                throw Error('Mail already in use!')
            }
            throw Error(err)
        }
    }

    async findUserByMail(mail: string): Promise<User | false> {
        const user = await this.userModel.findOne({ where: { mail } })
        if (!user) {
            return false
        }
        return fromDbToUser(user)
    }

    async modifyUser(user: IUserEdit): Promise<User | Error> {
        try {
            const [userEdited, userArray] = await this.userModel.update(user, { where: { id: user.id }, returning: true })
            // update returns an array, first argument is the number of elements updated in the
            // database. Second argument are the array of elements. Im updating by id so there is only 
            // one element in the array.
            if (!userEdited) {
                throw new Error("User not found")
            }
            const editedUser = fromDbToUser(userArray[0])

            return editedUser

        } catch (err) {
            throw new Error(err.message)
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