import { GetUsersDto } from "../dto/getUsersDto";
import { User } from "../entities/User";
import { IUserCreate } from "./IUserCreate";
import { IUserEdit } from "./IUserEdit";

export interface IUserRepository {
    getUsers: (limit?: number, offset?: number) => Promise<GetUsersDto>;
    getSingleUser: (id: number) => Promise<User>;
    createUser: (user: IUserCreate) => Promise<User>;
    findUserByMail: (mail: string) => Promise<User | false>;
    modifyUser: (id: number, user: IUserEdit) => Promise<User>;
    deleteUser: (id: number) => Promise<true>
}