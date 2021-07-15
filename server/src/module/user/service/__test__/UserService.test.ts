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

describe("Service.getSingleUser", () => {
    it('Should call repository getSingleUser once with 5 as parameter', async () => {
        await service.getSingleUser(5)
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
    it('Should call repository modifyUser once ', async () => {
        const userToModify: IUserEdit = { id: 3, mail: "test@gmail.com" }
        await service.modifyUser(userToModify)
        expect(userRepository.modifyUser).toBeCalledTimes(1)
        expect(userRepository.modifyUser).toBeCalledWith(userToModify)
    });
});

describe('userService.deleteUser', () => {
    it('Should call repository deleteUser once ', async () => {
        const DELETE_ID = 123
        await service.deleteUser(DELETE_ID)
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