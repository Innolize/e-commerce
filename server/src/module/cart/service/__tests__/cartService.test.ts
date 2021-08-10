import { CartService } from "../CartService";


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


beforeEach(() => {
    service = new CartService(repository)
});

afterEach(() => {
    jest.clearAllMocks();
});

