import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractService } from "../../abstractClasses/abstractService";
import { User } from "../entities/User";
import { IUserEdit } from "../interfaces/IUserEdit";
import bcrypt from "bcrypt"
import { UserError } from "../error/UserError";
import { GetUsersDto } from "../dto/getUsersDto";
import { IUserCreate } from "../interfaces/IUserCreate";
import { IUserService } from "../interfaces/IUserService";
import { IUserRepository } from "../interfaces/IUserRepository";
import { IUserGetUsers } from "../interfaces/IUserGetUsers";
import { IRoleName } from "../../authorization/interfaces/IRole";
import { ForbiddenError } from "@casl/ability";
import { IUserWithAuthorization } from "../../authorization/interfaces/IUserWithAuthorization";
import { appAbility } from "../../authorization/util/abilityBuilder";

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

    async getUsers(searchParam: IUserGetUsers): Promise<GetUsersDto> {
        const { limit, offset } = searchParam
        const response = await this.userRepository.getUsers(limit, offset)
        return response
    }

    async getSingleUser(id: number, user: IUserWithAuthorization): Promise<User> {
        const foundUser = await this._findUser(id)
        ForbiddenError.from<appAbility>(user.role.permissions).throwUnlessCan("read", foundUser)
        return foundUser
    }

    async createUser(user: IUserCreate, currentUserRole?: IRoleName): Promise<User> {
        const mailInUse = await this.userRepository.findUserByMail(user.mail)
        if (mailInUse) {
            throw UserError.mailAlreadyInUse()
        }
        const role_id = this._setNewUserRole(user.role_id, currentUserRole)
        const hashedPassword = await this._hashPassword(user.password)
        const userHashed: IUserCreate = { ...user, password: hashedPassword, role_id }
        return await this.userRepository.createUser(userHashed)
    }

    async findUserByMail(mail: string): Promise<User | false> {
        return await this.userRepository.findUserByMail(mail)
    }

    async modifyUser(id: number, userDTO: IUserEdit, user: IUserWithAuthorization): Promise<User> {
        const foundUser = await this._findUser(id)
        ForbiddenError.from<appAbility>(user.role.permissions).throwUnlessCan("update", foundUser)
        return await this.userRepository.modifyUser(id, userDTO)
    }

    async deleteUser(id: number, user: IUserWithAuthorization): Promise<true> {
        const foundUser = await this._findUser(id)
        ForbiddenError.from<appAbility>(user.role.permissions).throwUnlessCan("delete", foundUser)
        return await this.userRepository.deleteUser(id)
    }

    private async _findUser(id: number) {
        return await this.userRepository.getSingleUser(id)
    }

    private _setNewUserRole(roleId: number, role?: IRoleName) {
        const DEFAULT_ROLE_ID = 2
        return role === "ADMIN" ? roleId : DEFAULT_ROLE_ID
    }

    private async _hashPassword(password: string): Promise<string> {
        return await this.encryption.hash(password, Number(<string>process.env.BCRYPT_SALT_NUMBER))
    }
}