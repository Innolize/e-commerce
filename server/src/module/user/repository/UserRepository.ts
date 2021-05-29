import { inject, injectable } from "inversify";
import { UniqueConstraintError } from "sequelize";
import { TYPES } from "../../../config/inversify.types";
import { AbstractRepository } from "../../abstractClasses/abstractRepository";
import { RoleModel } from "../../authorization/module";
import { FullUser } from "../entities/FullUser";
import { User } from "../entities/User";
import { UserError } from "../error/UserError";
import { IUserEdit } from "../interfaces/IUserEdit";
import { fromDbToFullUser, fromDbToUser } from "../mapper/userMapper";
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

    async getSingleUser(id: number): Promise<FullUser | Error> {
            const user = await this.userModel.findByPk(id, { include: [{ association: UserModel.associations.role, include: [{ association: RoleModel.associations.permissions }] }] })
            if (!user) {
                throw UserError.notFound()
            }
            
            const response = fromDbToFullUser(user)
            return response
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
                throw UserError.notFound()
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
                throw UserError.notFound()
            }
            return true
        } catch (err) {
            throw Error(err.message)
        }
    }

}