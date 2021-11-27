import 'reflect-metadata'
import { Role } from '../../../authorization/entities/Role';
import { IUserWithAuthorization } from "../../../authorization/interfaces/IUserWithAuthorization";
import { buildAbility } from '../../../authorization/util/abilityBuilder';
import { Cart } from '../../../cart/entities/Cart';
import { Payment } from '../../../payment/entities/Payment';
import { Order } from "../../entities/Order";
import { OrderError } from '../../error/OrderError';
import { OrderService } from "../OrderService";

const orderRepository = {
    create: jest.fn(),
    delete: jest.fn(),
    getAll: jest.fn(),
    getSingle: jest.fn()
}

let service: OrderService

beforeEach(() => {
    service = new OrderService(orderRepository)
});

afterEach(() => {
    jest.clearAllMocks();
});
const PAYMENT: Payment = { id: 1, amount: 200, order_id: 1, status: 'PENDING', type: 'CASH' }
const defaultOrder = new Order(1, 1, undefined, PAYMENT)

const adminRole = new Role("ADMIN", 1, [{ action: 'manage', subject: 'all', role_id: 1 }])
const adminAbility = buildAbility(adminRole)
const clientRole = new Role("CLIENT", 2, [
    { action: 'read', subject: 'User', condition: '{"id": 2 }', role_id: 2 },
    { action: 'update', subject: 'User', condition: '{"id": 2 }', role_id: 2 },
    { action: 'delete', subject: 'User', condition: '{"id": 2 }', role_id: 2 }
])
const clientAbility = buildAbility(clientRole)
const ADMIN: IUserWithAuthorization = { id: 1, mail: "admin@gmail.com", role_id: 1, role: { ...adminRole, permissions: adminAbility } }
const CLIENT: IUserWithAuthorization = { id: 2, mail: "client@gmail.com", role_id: 2, role: { name: clientRole.name, permissions: clientAbility } }

describe('getAll', () => {

    it('should call repository.getAll once', async () => {
        orderRepository.getAll.mockImplementationOnce(() => Promise.resolve(defaultOrder))
        const orders = await service.getAll(ADMIN)
        expect(orderRepository.getAll).toHaveBeenCalledWith(undefined, undefined)
        expect(orderRepository.getAll).toHaveBeenCalledTimes(1)
        expect(orders).toBe(defaultOrder)
    });
    it('should bring user.id to getAll if actual user is not an admin', async () => {
        orderRepository.getAll.mockImplementationOnce(() => Promise.resolve(defaultOrder))
        const orders = await service.getAll(CLIENT)
        expect(orderRepository.getAll).toHaveBeenCalledWith(undefined, undefined, CLIENT.id)
        expect(orderRepository.getAll).toHaveBeenCalledTimes(1)
        expect(orders).toBe(defaultOrder)
    });
});

describe('create', () => {
    it('should create an order', async () => {
        const PAYMENT_METHOD = 'CASH'
        const cart = new Cart(1, 1, [
            { id: 1, cart_id: 1, product_id: 1, quantity: 3 }
        ])
        await service.create(cart, CLIENT, PAYMENT_METHOD)
        expect(orderRepository.create).toHaveBeenCalledWith(cart, CLIENT.id, PAYMENT_METHOD)
    });
});

describe('getSingle', () => {
    it('should call repository.getSingle once', async () => {
        const ID = 5
        await service.getSingle(ID)
        expect(orderRepository.getSingle).toHaveBeenCalledWith(ID)
        expect(orderRepository.getSingle).toHaveBeenCalledTimes(1)
    });
});

describe('delete', () => {
    it('should delete an order', async () => {
        orderRepository.getSingle.mockImplementationOnce(() => Promise.resolve(defaultOrder))
        orderRepository.delete.mockImplementationOnce(() => Promise.resolve(true))
        const result = await service.delete(1, ADMIN)
        expect(result).toStrictEqual(true)
    });

    it('should throw if order is already paid', async () => {
        const PAID_ORDER: Order = { ...defaultOrder, payment: { ...PAYMENT, status: 'PAID' } }
        orderRepository.getSingle.mockImplementationOnce(() => Promise.resolve(PAID_ORDER))
        expect.assertions(1)
        try {
            await service.delete(1, ADMIN)
        } catch (err) {
            expect(err).toStrictEqual(OrderError.deletePaidOrder())
        }
    });
});

