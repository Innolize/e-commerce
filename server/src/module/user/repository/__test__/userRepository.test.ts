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
    await sequelizeInstance.drop({ cascade: true })
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

afterAll(async (done) => {
    await sequelizeInstance.drop({ cascade: true });
    await sequelizeInstance.close();
    done();
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
        console.log(12345)
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

describe('Test modifyUser', () => {
    it('Modify an existent user ', async () => {
        const newUser: IUserCreate = {
            mail: "testmail@gmail.com",
            password: "testpassword",
            role_id: 1
        }
        await userModel.create(newUser)
        const response = await repository.modifyUser(1, { mail: "new-password" })
        expect(response.mail).toBe("new-password")
    });
    it('Returns error if no user was updated', async () => {
        try {
            const INEXISTENT_USER_ID = 555
            await repository.modifyUser(INEXISTENT_USER_ID, { mail: "new-password" })
        } catch (err) {
            expect(err).toBeInstanceOf(UserError)
        }
    });
});

describe('Test deleteUser', () => {
    it('Deletes an existent user from DB', async () => {
        const newUser: IUserCreate = {
            mail: "testmail@gmail.com",
            password: "testpassword",
            role_id: 1
        }
        await userModel.create(newUser)
        const response = await repository.deleteUser(1)
        expect(response).toBe(true)
    });
    it('Returns error if no user is found with selected id', async () => {
        const INEXISTENT_USER_ID = 555

        const newUser: IUserCreate = {
            mail: "testmail@gmail.com",
            password: "testpassword",
            role_id: 1
        }
        try {
            await userModel.create(newUser)
            await repository.deleteUser(INEXISTENT_USER_ID)
        } catch (err) {
            expect(err).toBeInstanceOf(UserError)
        }
    });
})

describe('Test getSingleUser', () => {
    it('Retrieves an user successfuly ', async () => {
        const newUser: IUserCreate = {
            mail: "testmail@gmail.com",
            password: "testpassword",
            role_id: 1
        }
        await userModel.create(newUser)
        const response = await repository.getSingleUser(1)
        expect(response).toBeInstanceOf(User)
        expect(response.mail).toBe(newUser.mail)
        expect(response.password).toBe(newUser.password)
    });
    it('Returns error if user was not found', async () => {
        const INEXISTENT_USER_ID = 555
        expect.assertions(1)
        try {
            await repository.getSingleUser(INEXISTENT_USER_ID)
        } catch (err) {
            expect(err).toBeInstanceOf(UserError)
        }
    });
});

describe('Test getUsers', () => {
    it('Retrieves count and array of users', async () => {
        const newUser: IUserCreate = {
            mail: "testUser1@gmail.com",
            password: "testUser1password",
            role_id: 1
        }
        const newUser2: IUserCreate = {
            mail: "testUser2@gmail.com",
            password: "testUser2password",
            role_id: 1
        }
        const newUser3: IUserCreate = {
            mail: "testUser3@gmail.com",
            password: "testUser3password",
            role_id: 1
        }
        await userModel.bulkCreate([newUser, newUser2, newUser3])
        const response = await repository.getUsers(3, 0)
        expect(response.count).toBe(3)
        expect(response.results[0].mail).toBe(newUser.mail)
        expect(response.results[0].password).toBe(newUser.password)
        expect(response.results[0].role_id).toBe(newUser.role_id)
        expect(response.results.length).toBe(3)
    });
});