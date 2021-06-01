import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractService } from "../../abstractClasses/abstractService";
import { User } from "../entities/User";
import { IUserEdit } from "../interfaces/IUserEdit";
import { UserRepository } from "../repository/UserRepository";
import bcrypt from "bcrypt"
import { UserError } from "../error/UserError";
import { fromRequestToUser } from "../mapper/userMapper";

@injectable()
export class UserService extends AbstractService {
    private userRepository: UserRepository
    private encryption: typeof bcrypt
    constructor(
        @inject(TYPES.User.Repository) userRepository: UserRepository,
        @inject(TYPES.Common.Encryption) encryption: typeof bcrypt
    ) {
        super()
        this.userRepository = userRepository
        this.encryption = encryption
    }

    async getUsers(): Promise<User[]> {
        const response = await this.userRepository.getUsers()
        return response
    }

    async getSingleUser(id: number): Promise<User | Error> {
        return await this.userRepository.getSingleUser(id)
    }

    async createUser(user: User): Promise<User | Error> {
        try {
            const mailInUse = await this.userRepository.findUserByMail(user.mail)
            if (mailInUse) {
                throw UserError.mailAlreadyInUse()
            }
            const hashedPassword = await this.encryption.hash(user.password, Number(<string>process.env.BCRYPT_SALT_NUMBER))
            const userHashed = fromRequestToUser({ ...user, password: hashedPassword })
            return await this.userRepository.createUser(userHashed)
        } catch (err) {
            throw Error(err.message)
        }
    }

    async findUserByMail(mail: string): Promise<User | false> {
        return await this.userRepository.findUserByMail(mail)
    }

    async modifyUser(user: IUserEdit): Promise<User | Error> {
        return await this.userRepository.modifyUser(user)
    }

    async deleteUser(id: number): Promise<true | Error> {
        return await this.userRepository.deleteUser(id)
    }
}