import { inject, injectable } from "inversify";
import { UniqueConstraintError } from "sequelize";
import { TYPES } from "../../../config/inversify.types";
import { AbstractRepository } from "../../abstractClasses/abstractRepository";
import { RoleModel } from "../../authorization/module";
import { User } from "../entities/User";
import { UserError } from "../error/UserError";
import { IUserEdit } from "../interfaces/IUserEdit";
import { fromDbToUser } from "../mapper/userMapper";
import { UserModel } from "../model/UserModel";
import { GetUsersDto } from '../dto/getUsersDto'
import { GetUserReqDto } from "../dto/getUsersReqDto";
import { IUserCreate } from "../interfaces/IUserCreate";
import { IUserRepository } from "../interfaces/IUserRepository";

@injectable()
export class UserRepository extends AbstractRepository implements IUserRepository {
    private userModel: typeof UserModel
    constructor(
        @inject(TYPES.User.Model) userModel: typeof UserModel
    ) {
        super()
        this.userModel = userModel
    }

    async getUsers(queryParams: GetUserReqDto): Promise<GetUsersDto> {
        const { offset, limit } = queryParams
        const { count, rows } = await this.userModel.findAndCountAll({ limit, offset })
        const usersList = rows.map(fromDbToUser)
        const response = new GetUsersDto(count, usersList)
        return response
    }

    async getSingleUser(id: number): Promise<User> {
        const user = await this.userModel.findByPk(id, { include: [{ association: UserModel.associations.role, include: [{ association: RoleModel.associations.permissions }] }, { association: UserModel.associations.cart }] })
        if (!user) {
            throw UserError.notFound()
        }
        const response = fromDbToUser(user)
        return response
    }

    async createUser(user: IUserCreate): Promise<User> {
        try {
            const newUser = await this.userModel.create(user)
            await newUser.createCart()
            return fromDbToUser(newUser)
        } catch (err) {
            if (err instanceof UniqueConstraintError) {
                throw UserError.mailAlreadyInUse()
            }
            throw err
        }
    }

    async findUserByMail(mail: string): Promise<User | false> {
        const user = await this.userModel.findOne({ where: { mail } })
        if (!user) {
            return false
        }
        return fromDbToUser(user)
    }

    async modifyUser(user: IUserEdit): Promise<User> {

        const [userEdited, userArray] = await this.userModel.update(user, { where: { id: user.id }, returning: true })
        // update returns an array, first argument is the number of elements updated in the
        // database. Second argument are the array of elements. Im updating by id so there is only 
        // one element in the array.
        if (!userEdited) {
            throw UserError.notFound()
        }
        const editedUser = fromDbToUser(userArray[0])
        return editedUser

    }

    async deleteUser(id: number): Promise<true> {
        const response = await this.userModel.destroy({ where: { id } })
        if (!response) {
            throw UserError.notFound()
        }
        return true
    }

}