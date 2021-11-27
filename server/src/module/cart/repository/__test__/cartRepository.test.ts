import 'reflect-metadata'
import dotenv from 'dotenv'
dotenv.config()
import { Sequelize } from "sequelize";
import { ProductModel } from '../../../product/module';
import { UserModel } from '../../../user/module';
import { CartItemModel } from '../../model/CartItemModel';
import { CartModel } from '../../model/CartModel';

import { CartRepository } from "../CartRepository";
import { Cart } from '../../entities/Cart';
import { BrandModel } from '../../../brand/module';
import { CategoryModel } from '../../../category/module';
import { CartError } from '../../error/CartError';
import { CartItem } from '../../entities/CartItem';
import { ICartItemCreateFromCartModel } from '../../interface/ICartItemCreateFromCart';

let repository: CartRepository
let sequelizeInstance: Sequelize
let cartModel: typeof CartModel
let cartItemModel: typeof CartItemModel
let productModel: typeof ProductModel
let userModel: typeof UserModel
let brand: typeof BrandModel
let category: typeof CategoryModel
let brandModel: typeof BrandModel

beforeAll(async () => {
    sequelizeInstance = new Sequelize(<string>process.env.TEST_DATABASE_URL, {
        logging: false,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        dialect: 'postgres'
    });
    await sequelizeInstance.drop({ cascade: true })
    cartModel = CartModel.setup(sequelizeInstance)
    cartItemModel = CartItemModel.setup(sequelizeInstance)
    productModel = ProductModel.setup(sequelizeInstance)
    brandModel = BrandModel.setup(sequelizeInstance)
    userModel = UserModel.setup(sequelizeInstance)
    brand = BrandModel.setup(sequelizeInstance)
    category = CategoryModel.setup(sequelizeInstance)
    cartModel.setupCartItemAssociation(cartItemModel)
    cartModel.setupUserAssociation(userModel)
    cartItemModel.setupProductAssociation(productModel)
    productModel.setupBrandAssociation(brand)
    productModel.setupCartItemAssociation(cartItemModel)
    productModel.setupCategoryAssociation(category)
    repository = new CartRepository(cartModel, cartItemModel, productModel)
});

beforeEach(async () => {
    await sequelizeInstance.sync({ force: true })
    try {
        await Promise.all([
            await userModel.create({ mail: 'user@test.com', password: 'test-password', role_id: 1 }),
            await userModel.create({ mail: 'user2@test.com', password: 'test-password2', role_id: 1 }),
            await userModel.create({ mail: 'user3@test.com', password: 'test-password3', role_id: 1 }),
            await userModel.create({ mail: 'user4@test.com', password: 'test-password4', role_id: 1 }),
            await userModel.create({ mail: 'user5@test.com', password: 'test-password5', role_id: 1 }),
            await userModel.create({ mail: 'user6@test.com', password: 'test-password6', role_id: 1 }),
            await cartModel.create({ user_id: 1 }),
            await cartModel.create({ user_id: 2 }),
            await cartModel.create({ user_id: 3 }),
            await cartModel.create({ user_id: 4 }),
            await cartModel.create({ user_id: 5 }),
            await cartModel.create({ user_id: 6 })
        ])

    } catch (err) {
        console.log(err)
    }

});

afterAll(async () => {
    await sequelizeInstance.close()
});



describe('getAll', () => {
    it('should retrieve carts successfully', async () => {
        const TOTAL_COUNT = 6
        const LIMIT = 5
        const carts = await repository.getAll({ limit: LIMIT, offset: 0 })
        expect(carts.count).toBe(TOTAL_COUNT)
        expect(carts.results[0]).toBeInstanceOf(Cart)
        expect(carts.results.length).toBe(LIMIT)
    });
});

describe('getCart', () => {
    it('should retrieve a cart with given id', async () => {
        const CART_ID = 5
        const cart = await repository.getCart(CART_ID)
        expect(cart).toBeInstanceOf(Cart)
        expect(cart.id).toBe(CART_ID)
    });
    it('should find a cart with given id and user id', async () => {
        const CART_ID = 5
        const USER_ID = 5
        const cart = await repository.getCart(CART_ID, USER_ID)
        expect(cart).toBeInstanceOf(Cart)
        expect(cart.user_id).toBe(USER_ID)
    });
    it('should throw if cart not found', async () => {
        const CART_ID = 500
        expect.assertions(1)
        try {
            await repository.getCart(CART_ID)
        } catch (err) {
            expect(err).toEqual(CartError.cartNotFound())
        }
    });
});

describe('getCartItem', () => {
    it('should retrieve cart item', async () => {
        await category.create({ name: 'test-category' })
        await brandModel.create({ name: 'test-brand', logo: null })
        await productModel.create({ description: 'test-description', id_brand: 1, id_category: 1, image: null, name: 'product-test', price: 200, stock: true })
        await cartItemModel.create({ cart_id: 1, product_id: 1, quantity: 1 })
        const CART_ITEM_ID = 1
        const cartItem = await repository.getCartItem(CART_ITEM_ID)
        expect(cartItem).toBeInstanceOf(CartItem)
        expect(cartItem.id).toBe(CART_ITEM_ID)
    });
    it('should throw if cart item was not found', async () => {
        expect.assertions(1)
        try {
            const CART_ITEM_ID = 1
            await repository.getCartItem(CART_ITEM_ID)
        } catch (err) {
            expect(err).toEqual(CartError.cartItemNotFound())
        }
    });
});

describe('addCartItem', () => {
    it('should add item to cart', async () => {
        await category.create({ name: 'test-category' })
        await brandModel.create({ name: 'test-brand', logo: null })
        await productModel.create({ description: 'test-description', id_brand: 1, id_category: 1, image: null, name: 'product-test', price: 200, stock: true })
        const CART_ID = 1
        const ITEM: ICartItemCreateFromCartModel = { product_id: 1, quantity: 1 }
        const updatedCartItem = await repository.addCartItem(CART_ID, ITEM)
        expect(updatedCartItem).toBeInstanceOf(CartItem)
    });
    it('should handle throws if problem related to foreign keys', async () => {
        expect.assertions(1)
        try {
            const CART_ID = 1
            const INVALID_PRODUCT_ID = 123456
            const ITEM: ICartItemCreateFromCartModel = { product_id: INVALID_PRODUCT_ID, quantity: 1 }
            await repository.addCartItem(CART_ID, ITEM)
        } catch (err) {
            expect(err).toEqual(CartError.invalidProductId())
        }
    });
});

describe('removeCartItem', () => {

    it('should remove cart item from cart', async () => {
        await category.create({ name: 'test-category' })
        await brandModel.create({ name: 'test-brand', logo: null })
        await productModel.create({ description: 'test-description', id_brand: 1, id_category: 1, image: null, name: 'product-test', price: 200, stock: true })
        await cartItemModel.create({ cart_id: 2, product_id: 1, quantity: 3 })

        const CART_ID = 2
        const CART_ITEM_ID = 1
        const response = await repository.removeCartItem(CART_ID, CART_ITEM_ID)
        expect(response).toBe(true)
    });

    it('should throw if cart item was not found', async () => {
        const CART_ID = 2
        const CART_ITEM_ID = 1
        expect.assertions(1)
        try {
            await repository.removeCartItem(CART_ID, CART_ITEM_ID)
        } catch (err) {
            expect(err).toEqual(CartError.cartItemNotFound())
        }

    });
});

describe('modifyCartItemQuantity', () => {
    it('should update item quantity ', async () => {
        await category.create({ name: 'test-category' })
        await brandModel.create({ name: 'test-brand', logo: null })
        await productModel.create({ description: 'test-description', id_brand: 1, id_category: 1, image: null, name: 'product-test', price: 200, stock: true })
        await cartItemModel.create({ cart_id: 2, product_id: 1, quantity: 3 })

        const CART_ID = 2
        const ITEM_ID = 1
        const NEW_QUANTITY = 5
        const response = await repository.modifyCartItemQuantity(CART_ID, ITEM_ID, NEW_QUANTITY)
        expect(response).toBe(true)
    });

    it('should throw if cart item was not found', async () => {
        expect.assertions(1)
        try {
            const CART_ID = 512
            const ITEM_ID = 22
            const NEW_QUANTITY = 5
            await repository.modifyCartItemQuantity(CART_ID, ITEM_ID, NEW_QUANTITY)
        } catch (err) {
            expect(err).toEqual(CartError.cartItemNotFound())
        }
    });
});

describe('removeAllItemsFromCart', () => {
    it('should remove all items from cart', async () => {
        await category.create({ name: 'test-category' })
        await brandModel.create({ name: 'test-brand', logo: null })
        await productModel.create({ description: 'test-description', id_brand: 1, id_category: 1, image: null, name: 'product-test', price: 200, stock: true })
        await productModel.create({ description: 'test-description2', id_brand: 1, id_category: 1, image: null, name: 'product-test2', price: 202, stock: false })
        await cartItemModel.create({ cart_id: 2, product_id: 1, quantity: 3 })
        await cartItemModel.create({ cart_id: 2, product_id: 2, quantity: 3 })
        const TARGET_CART_ID = 2
        const response = await repository.removeAllItemsFromCart(TARGET_CART_ID)
        expect(response).toBe(2)
    });
});