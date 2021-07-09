import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractService } from "../../abstractClasses/abstractService";
import { User } from "../entities/User";
import { IUserEdit } from "../interfaces/IUserEdit";
import bcrypt from "bcrypt"
import { UserError } from "../error/UserError";
import { GetUsersDto } from "../dto/getUsersDto";
import { GetUserReqDto } from "../dto/getUsersReqDto";
import { IUserCreate } from "../interfaces/IUserCreate";
import { IUserService } from "../interfaces/IUserService";
import { IUserRepository } from "../interfaces/IUserRepository";

@injectable()
export class UserService extends AbstractService implements IUserService {
    private encryption: typeof bcrypt
    constructor(
        @inject(TYPES.User.Repository) private userRepository: IUserRepository,
        @inject(TYPES.Common.Encryption) encryption: typeof bcrypt
    ) {
        super()
        this.userRepository = userRepository
        this.encryption = encryption
    }

    async getUsers(searchParam: GetUserReqDto): Promise<GetUsersDto> {
        const response = await this.userRepository.getUsers(searchParam)
        return response
    }

    async getSingleUser(id: number): Promise<User> {
        return await this.userRepository.getSingleUser(id)
    }

    async createUser(user: IUserCreate, loggedRole?: number): Promise<User> {
        const DEFAULT_ROLE_ID = 2
        try {
            const mailInUse = await this.userRepository.findUserByMail(user.mail)
            if (mailInUse) {
                throw UserError.mailAlreadyInUse()
            }

            const role_id = loggedRole === 1 ? user.role_id : DEFAULT_ROLE_ID
            const hashedPassword = await this.encryption.hash(user.password, Number(<string>process.env.BCRYPT_SALT_NUMBER))
            const userHashed: IUserCreate = { ...user, password: hashedPassword, role_id }
            return await this.userRepository.createUser(userHashed)
        } catch (err) {
            throw Error(err.message)
        }
    }

    async findUserByMail(mail: string): Promise<User | false> {
        return await this.userRepository.findUserByMail(mail)
    }

    async modifyUser(user: IUserEdit): Promise<User> {
        return await this.userRepository.modifyUser(user)
    }

    async deleteUser(id: number): Promise<true> {
        return await this.userRepository.deleteUser(id)
    }
}