import { GetUsersDto } from "../dto/getUsersDto";
import { GetUserReqDto } from "../dto/getUsersReqDto";
import { User } from "../entities/User";
import { IUserCreate } from "./IUserCreate";
import { IUserEdit } from "./IUserEdit";

export interface IUserService {
    getUsers: (searchParam: GetUserReqDto) => Promise<GetUsersDto>;
    getSingleUser: (id: number) => Promise<User>;
    createUser: (user: IUserCreate) => Promise<User>;
    findUserByMail: (mail: string) => Promise<User | false>;
    modifyUser: (user: IUserEdit) => Promise<User>;
    deleteUser: (id: number) => Promise<true>;
}