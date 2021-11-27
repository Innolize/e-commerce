import "reflect-metadata";
import dotenv from 'dotenv'
dotenv.config()
import { mocked } from 'ts-jest/utils'
import bcript from 'bcrypt';
import { UserService } from "../UserService";
import { IUserEdit } from "../../interfaces/IUserEdit";
import { IUserCreate } from "../../interfaces/IUserCreate";
import { UserError } from "../../error/UserError";
import { User } from "../../entities/User";
import { IUserWithAuthorization } from "../../../authorization/interfaces/IUserWithAuthorization";
import { buildAbility } from "../../../authorization/util/abilityBuilder";
import { Role } from "../../../authorization/entities/Role";
import { ForbiddenError } from "@casl/ability";
jest.mock('bcrypt');

const mockedBcrypt = mocked(bcript, true)

let service: UserService
const userRepository = {
    createUser: jest.fn(),
    deleteUser: jest.fn(),
    findUserByMail: jest.fn(),
    getUsers: jest.fn(),
    getSingleUser: jest.fn(),
    modifyUser: jest.fn()
}
beforeAll(() => {
    service = new UserService(userRepository, mockedBcrypt)
});

afterEach(() => {
    jest.clearAllMocks();
});

const adminRole = new Role("ADMIN", 1, [{ action: 'manage', subject: 'all', role_id: 1 }])
const adminAbility = buildAbility(adminRole)
const clientRole = new Role("CLIENT", 2, [
    { action: 'read', subject: 'User', condition: '{"id": 2 }', role_id: 2 },
    { action: 'update', subject: 'User', condition: '{"id": 2 }', role_id: 2 },
    { action: 'delete', subject: 'User', condition: '{"id": 2 }', role_id: 2 }
])
const clientAbility = buildAbility(clientRole)
const admin: IUserWithAuthorization = { id: 1, mail: "admin@gmail.com", role_id: 1, role: { ...adminRole, permissions: adminAbility } }
const client: IUserWithAuthorization = { id: 2, mail: "client@gmail.com", role_id: 2, role: { name: clientRole.name, permissions: clientAbility } }

describe("Service.getSingleUser", () => {
    it('Should call repository getSingleUser once with 5 as parameter', async () => {
        await service.getSingleUser(5, admin)
        expect(userRepository.getSingleUser).toHaveBeenCalledTimes(1)
        expect(userRepository.getSingleUser).toHaveBeenCalledWith(5)
    });
})
describe('Service.findUserByMail', () => {
    it('Should call repository findUserByMail once', async () => {
        const TEST_MAIL = "test@gmail.com"
        await service.findUserByMail(TEST_MAIL)
        expect(userRepository.findUserByMail).toHaveBeenCalledTimes(1)
        expect(userRepository.findUserByMail).toHaveBeenCalledWith(TEST_MAIL)
    });
});

describe('Service.modifyUser', () => {
    it('Should update any user as admin ', async () => {
        const adminUser = new User(1, "admin@gmail.com", "adminPassword", 1)
        userRepository.getSingleUser.mockImplementationOnce(() => Promise.resolve(adminUser))
        const userToModify: IUserEdit = { mail: "test@gmail.com" }
        await service.modifyUser(1, userToModify, admin)
        expect(userRepository.modifyUser).toBeCalledTimes(1)
        expect(userRepository.modifyUser).toBeCalledWith(1, userToModify)
    });
    it('Should update own user as client ', async () => {
        const CLIENT_ID = client.id
        const targetUser = new User(CLIENT_ID, "client@gmail.com", "clientPassword", 2)
        userRepository.getSingleUser.mockImplementationOnce(() => Promise.resolve(targetUser))
        const userToModify: IUserEdit = { mail: "test@gmail.com" }
        await service.modifyUser(CLIENT_ID, userToModify, client)
        expect(userRepository.modifyUser).toBeCalledTimes(1)
        expect(userRepository.modifyUser).toBeCalledWith(CLIENT_ID, userToModify)
    });
    it('Should throw if is not own user as client ', async () => {
        const RANDOM_ID = 123456
        const targetUser = new User(1, "client@gmail.com", "clientPassword", 2)
        userRepository.getSingleUser.mockImplementationOnce(() => Promise.resolve(targetUser))
        const userToModify: IUserEdit = { mail: "test@gmail.com" }
        expect.assertions(1)
        try {
            await service.modifyUser(RANDOM_ID, userToModify, client)
        } catch (err) {
            expect(err).toBeInstanceOf(ForbiddenError)
        }
    });
});

describe('userService.deleteUser', () => {
    it('Should call repository deleteUser once ', async () => {
        const DELETE_ID = 123
        await service.deleteUser(DELETE_ID, admin)
        expect(userRepository.deleteUser).toBeCalledTimes(1)
        expect(userRepository.deleteUser).toBeCalledWith(DELETE_ID)
    });
});

describe('userService.getUsers', () => {
    it('Should call repository getUsers once ', async () => {
        const TEST_LIMIT = 10
        const TEST_OFFSET = 0
        await service.getUsers({ limit: TEST_LIMIT, offset: TEST_OFFSET })
        expect(userRepository.getUsers).toBeCalledTimes(1)
        expect(userRepository.getUsers).toBeCalledWith(TEST_LIMIT, TEST_OFFSET)
    });
});

describe('userService.createUser', () => {
    it('Should encrypt and set any role_id as admin', async () => {
        const ENCRYPTED_PASSWORD = "hashedPassword"
        mockedBcrypt.hash.mockImplementationOnce(() => Promise.resolve(ENCRYPTED_PASSWORD))
        const testUser: IUserCreate = { mail: "test@gmail.com", password: "test_password", role_id: 1 }
        await service.createUser(testUser, 'ADMIN')
        expect(userRepository.findUserByMail).toBeCalledTimes(1)
        expect(userRepository.findUserByMail).toBeCalledWith("test@gmail.com")
        expect(mockedBcrypt.hash).toHaveBeenCalledWith("test_password", Number(<string>process.env.BCRYPT_SALT_NUMBER))
        expect(userRepository.createUser).toHaveBeenCalledWith({ ...testUser, password: ENCRYPTED_PASSWORD })
    })

    it('Should always create an user with id 2 as client', async () => {
        const ENCRYPTED_PASSWORD = "hashedPassword"
        mockedBcrypt.hash.mockImplementationOnce(() => Promise.resolve(ENCRYPTED_PASSWORD))
        const testUser: IUserCreate = { mail: "test@gmail.com", password: "test_password", role_id: 1 }
        await service.createUser(testUser, 'CLIENT')
        expect(userRepository.findUserByMail).toBeCalledTimes(1)
        expect(userRepository.findUserByMail).toBeCalledWith("test@gmail.com")
        expect(mockedBcrypt.hash).toHaveBeenCalledWith("test_password", Number(<string>process.env.BCRYPT_SALT_NUMBER))
        expect(userRepository.createUser).toHaveBeenCalledWith({ ...testUser, password: ENCRYPTED_PASSWORD, role_id: 2 })
    })

    it('Should throw an error if mail is already in use ', async () => {
        const USER_RESPONSE = new User(1, "test@gmail.com", "test_passowrd", 1)
        userRepository.findUserByMail.mockImplementationOnce(() => Promise.resolve(USER_RESPONSE))
        const testUser: IUserCreate = { mail: "test@gmail.com", password: "test_password", role_id: 1 }
        expect(service.createUser(testUser, "ADMIN")).rejects.toThrowError(UserError.mailAlreadyInUse())
    });
});