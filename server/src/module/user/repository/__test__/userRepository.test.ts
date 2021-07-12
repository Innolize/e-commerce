import "reflect-metadata";
import dotenv from 'dotenv'
import { Sequelize } from "sequelize";
import { UserModel } from "../../model/UserModel";
import { IUserRepository } from "../../interfaces/IUserRepository";
import { UserRepository } from "../UserRepository";
import { IUserCreate } from "../../interfaces/IUserCreate";
import { CartModel } from "../../../cart/module";
import { PermissionModel, RoleModel } from "../../../authorization/module";
import { User } from "../../entities/User";
import { UserError } from "../../error/UserError";
dotenv.config()


let sequelizeInstance: Sequelize
let userModel: typeof UserModel
let cartModel: typeof CartModel
let roleModel: typeof RoleModel
let permissionModel: typeof PermissionModel
let repository: IUserRepository

beforeAll(async (done) => {
    sequelizeInstance = new Sequelize(<string>process.env.TEST_DATABASE_URL, {
        logging: false,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        dialect: 'postgres'
    });
    userModel = UserModel.setup(sequelizeInstance);
    cartModel = CartModel.setup(sequelizeInstance);
    roleModel = RoleModel.setup(sequelizeInstance);
    permissionModel = PermissionModel.setup(sequelizeInstance);
    userModel.setupCartAssociation(cartModel);
    userModel.setupRoleAssociation(roleModel);
    cartModel.setupUserAssociation(userModel);
    roleModel.setupPermissionAssociation(permissionModel);
    done();
})

beforeEach(async (done) => {
    repository = new UserRepository(userModel);
    await sequelizeInstance.sync({ force: true });
    await roleModel.create({ name: "ADMIN" });
    await roleModel.create({ name: "CLIENT" });
    done();
})

afterAll(async () => {
    await sequelizeInstance.drop({ cascade: true });
    await sequelizeInstance.close();
});

describe("Create users", () => {
    it("Creates an user", async () => {
        const newUser: IUserCreate = {
            mail: "userMail@gmail.com",
            password: "testpassword",
            role_id: 2
        }
        const response = await repository.createUser(newUser)
        const EXPECTED_RESPONSE = new User(
            1,
            "userMail@gmail.com",
            "testpassword",
            2,
            undefined,
            undefined
        )
        expect(response).toEqual(EXPECTED_RESPONSE);
    });
    it("Gives error when creating an user with an email already in use", async () => {
        const newUser: IUserCreate = {
            mail: "userMail@gmail.com",
            password: "testpassword",
            role_id: 1
        }
        await repository.createUser(newUser)
        await expect(repository.createUser(newUser)).rejects.toThrow(UserError.mailAlreadyInUse())
    });
})

describe("Test findUserByMail ", () => {
    const TEST_MAIL = "test@gmail.com"
    it("finds an user by mail", async () => {
        const EXPECTED_RESPONSE = new User(
            1,
            TEST_MAIL,
            "testpassword",
            1,
            undefined,
            undefined
        )
        const newUser: IUserCreate = {
            mail: TEST_MAIL,
            password: "testpassword",
            role_id: 1
        }
        await repository.createUser(newUser)

        const userFromDB = await repository.findUserByMail(TEST_MAIL)
        expect(userFromDB).toBeInstanceOf(User)
        expect(userFromDB).toEqual(EXPECTED_RESPONSE)
    });
    it("returns false if there is no user with mail", async () => {
        const newUser: IUserCreate = {
            mail: TEST_MAIL,
            password: "testpassword",
            role_id: 1
        }
        await repository.createUser(newUser)
        const response = await repository.findUserByMail("invalidEmail@gmail.com")
        expect(response).toBe(false)
    });
})