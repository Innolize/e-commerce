import { IUserWithAuthorization } from "../../authorization/interfaces/IUserWithAuthorization";
import { GetUsersDto } from "../dto/getUsersDto";
import { GetUserReqDto } from "../dto/getUsersReqDto";
import { User } from "../entities/User";
import { IUserCreate } from "./IUserCreate";
import { IUserEdit } from "./IUserEdit";

export interface IUserService {
    getUsers: (searchParam: GetUserReqDto) => Promise<GetUsersDto>;
    getSingleUser: (id: number, user: IUserWithAuthorization) => Promise<User>;
    createUser: (user: IUserCreate) => Promise<User>;
    findUserByMail: (mail: string) => Promise<User | false>;
    modifyUser: (id: number, userToEdit: IUserEdit, user: IUserWithAuthorization) => Promise<User>;
    deleteUser: (id: number, user: IUserWithAuthorization) => Promise<true>;
}