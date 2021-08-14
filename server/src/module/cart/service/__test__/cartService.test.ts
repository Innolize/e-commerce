import 'reflect-metadata'
import { ForbiddenError } from "@casl/ability";
import { Permission } from "../../../authorization/entities/Permission";
import { Role } from "../../../authorization/entities/Role";
import { IUserWithAuthorization } from "../../../authorization/interfaces/IUserWithAuthorization";
import { buildAbility } from "../../../authorization/util/abilityBuilder";
import { CartService } from "../CartService";
import { Cart } from '../../entities/Cart';
import { ICartItemCreateFromCartModel } from '../../interface/ICartItemCreateFromCart';


let service: CartService

const repository = {
    addCartItem: jest.fn(),
    getAll: jest.fn(),
    getCart: jest.fn(),
    getCartItem: jest.fn(),
    modifyCartItemQuantity: jest.fn(),
    removeAllItemsFromCart: jest.fn(),
    removeCartItem: jest.fn()
}

const ADMIN_ROLE = new Role('ADMIN', 1, [
    new Permission(1, 'manage', 'all')
])

const CLIENT_ROLE = new Role("CLIENT", 2, [
    { action: 'read', subject: 'User', condition: '{"id": 2 }', role_id: 2 },
    { action: 'update', subject: 'User', condition: '{"id": 2 }', role_id: 2 },
    { action: 'delete', subject: 'User', condition: '{"id": 2 }', role_id: 2 },
    { action: 'read', subject: 'Cart', condition: '{"user_id": 2}', role_id: 2 },
    { action: 'update', subject: 'Cart', condition: '{"user_id": 2}', role_id: 2 },
    { action: 'delete', subject: 'Cart', condition: '{"user_id": 2}', role_id: 2 },
])

const CLIENT_PERMISSIONS = buildAbility(CLIENT_ROLE)

const ADMIN_PERMISSIONS = buildAbility(ADMIN_ROLE)

const ADMIN_USER: IUserWithAuthorization = {
    id: 1,
    mail: 'admin@admin.com', role: {
        name: 'ADMIN',
        permissions: ADMIN_PERMISSIONS,
    }, role_id: 1
}

const CLIENT_USER: IUserWithAuthorization = {
    id: 2,
    mail: 'client@client.com',
    role: {
        name: 'CLIENT',
        permissions: CLIENT_PERMISSIONS
    },
    role_id: 2
}

beforeEach(() => {
    service = new CartService(repository)
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('getCarts', () => {
    const SEARCH_PARAMS = { limit: 1, offset: 1 }
    it('should throw if client tries to retrieve carts', async () => {
        expect.assertions(1)
        try {
            await service.getCarts(SEARCH_PARAMS, CLIENT_USER)
        } catch (err) {
            expect(err).toBeInstanceOf(ForbiddenError)
        }
    });

    it('should retrieve carts if admin', async () => {
        await service.getCarts(SEARCH_PARAMS, ADMIN_USER)
        expect(repository.getAll).toHaveBeenCalledTimes(1)
        expect(repository.getAll).toHaveBeenCalledWith(SEARCH_PARAMS)
    });
});

describe('getCart', () => {
    const CART_ID = 5
    const CART_MOCK = new Cart(5, 2, undefined)
    repository.getCart.mockImplementation(async () => CART_MOCK)
    it('should retrieve cart if user is admin', async () => {
        await service.getCart(CART_ID, ADMIN_USER)
        expect(repository.getCart).toHaveBeenCalledTimes(1)
        expect(repository.getCart).toHaveBeenCalledWith(CART_ID)
    });

    it('should call repository.getCart with two params if user is not an admin', async () => {
        await service.getCart(CART_ID, CLIENT_USER)
        expect(repository.getCart).toHaveBeenCalledTimes(1)
        expect(repository.getCart).toHaveBeenCalledWith(CART_ID, CLIENT_USER.id)
    });

    it('should throw if client tries to access not his own cart', async () => {
        const CART_2_MOCK = new Cart(125, 15, undefined)
        repository.getCart.mockImplementationOnce(async () => CART_2_MOCK)
        expect.assertions(2)
        try {
            await service.getCart(CART_ID, CLIENT_USER)
        } catch (err) {
            expect(repository.getCart).toHaveBeenCalledTimes(1)
            expect(err).toBeInstanceOf(ForbiddenError)
        }
    });
});

describe('addCartItem', () => {
    it('should add cart item to cart with given id as admin', async () => {
        const CART_ID = 5
        const CART_ITEM: ICartItemCreateFromCartModel = { product_id: 3, quantity: 8 }
        const SERVICE_GET_CART_MOCK: Cart = { id: 2, user_id: 2, cartItems: [] }
        repository.getCart.mockImplementationOnce(async () => SERVICE_GET_CART_MOCK)
        await service.addCartItem(CART_ID, CART_ITEM, ADMIN_USER)
        expect(repository.addCartItem).toHaveBeenCalledTimes(1)
        expect(repository.getCart).toHaveBeenCalledTimes(2)
    });

    it('should modify cart item quantity if item already exists in cart', async () => {
        const CART_ID = 2
        const CART_ITEM: ICartItemCreateFromCartModel = { product_id: 3, quantity: 8 }
        const SERVICE_GET_CART_MOCK: Cart = { id: 2, user_id: 2, cartItems: [{ product_id: 3, quantity: 1, cart_id: 2, id: 5 }] }
        repository.getCart.mockImplementationOnce(async () => SERVICE_GET_CART_MOCK)
        await service.addCartItem(CART_ID, CART_ITEM, ADMIN_USER)
        expect(repository.getCart).toHaveBeenCalledTimes(2)
        expect(repository.modifyCartItemQuantity).toHaveBeenCalledTimes(1)
    });

    it('should throw if user tries to modify an cart who doesnt belong to him', async () => {
        const CART_ID = 3
        const CART_ITEM: ICartItemCreateFromCartModel = { product_id: 3, quantity: 8 }
        const SERVICE_GET_CART_MOCK: Cart = new Cart(2, 3, [{ product_id: 3, quantity: 1, cart_id: 2, id: 5 }])
        repository.getCart.mockImplementationOnce(async () => SERVICE_GET_CART_MOCK)
        expect.assertions(2)
        try {
            await service.addCartItem(CART_ID, CART_ITEM, CLIENT_USER)
        } catch (err) {
            expect(repository.getCart).toHaveBeenCalledTimes(1)
            expect(err).toBeInstanceOf(ForbiddenError)
        }
    });
});

describe('removeCartItem', () => {
    it('should be able to delete an item from cart', async () => {
        const CART_ID = 5
        const CART_ITEM_ID = 125
        const SERVICE_GET_CART_MOCK: Cart = new Cart(2, 2, [])

        repository.getCart.mockImplementationOnce(async () => SERVICE_GET_CART_MOCK)
        await service.removeCartItem(CART_ID, CART_ITEM_ID, CLIENT_USER)
        expect(repository.removeCartItem).toHaveBeenCalledWith(CART_ID, CART_ITEM_ID)
        expect(repository.getCart).toHaveBeenCalledTimes(2)
    });

    it('should not be able to delete an item if cart doesnt belong to user', async () => {
        const CART_ID = 5
        const CART_ITEM_ID = 125
        const SERVICE_GET_CART_MOCK: Cart = new Cart(2, 5, [])
        repository.getCart.mockImplementationOnce(async () => SERVICE_GET_CART_MOCK)
        expect.assertions(2)
        try {
            await service.removeCartItem(CART_ID, CART_ITEM_ID, CLIENT_USER)
        } catch (err) {
            expect(err).toBeInstanceOf(ForbiddenError)
            expect(repository.removeCartItem).toHaveBeenCalledTimes(0)
        }
    });
});

describe('clearCartItems', () => {
    it('should be able to clear cart correctly', async () => {
        const CART_ID = 5
        const SERVICE_GET_CART_MOCK: Cart = new Cart(2, 2, [])
        repository.getCart.mockImplementationOnce(async () => SERVICE_GET_CART_MOCK)
        await service.clearCartItems(CART_ID, CLIENT_USER)
        expect(repository.removeAllItemsFromCart).toHaveBeenCalledTimes(1)
        expect(repository.removeAllItemsFromCart).toHaveBeenCalledWith(CART_ID)
    });

    it('should not be able to clear cart if cart doesnt belong to user', async () => {
        const CART_ID = 5
        const SERVICE_GET_CART_MOCK: Cart = new Cart(2, 5, [])
        repository.getCart.mockImplementationOnce(async () => SERVICE_GET_CART_MOCK)
        expect.assertions(2)
        try {
            await service.clearCartItems(CART_ID, CLIENT_USER)
        } catch (err) {
            expect(err).toBeInstanceOf(ForbiddenError)
            expect(repository.removeAllItemsFromCart).toHaveBeenCalledTimes(0)
        }
    });
});