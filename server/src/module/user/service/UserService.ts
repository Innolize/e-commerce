import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractService } from "../../abstractClasses/abstractService";
import { User } from "../entities/User";
import { IUserEdit } from "../interfaces/IUserEdit";
import { UserRepository } from "../repository/UserRepository";

@injectable()
export class UserService extends AbstractService {
    private userRepository: UserRepository
    constructor(
        @inject(TYPES.User.Repository) userRepository: UserRepository
    ) {
        super()
        this.userRepository = userRepository
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
            return await this.userRepository.createUser(user)
        } catch (err) {
            throw Error(err.message)
        }

    }

    async modifyUser(user: IUserEdit): Promise<User | Error> {
        return await this.userRepository.modifyUser(user)
    }

    async deleteUser(id: number): Promise<true | Error> {
        return await this.userRepository.deleteUser(id)
    }
}