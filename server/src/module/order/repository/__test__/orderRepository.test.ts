import 'reflect-metadata'
import dotenv from 'dotenv'
dotenv.config();
import { Sequelize } from "sequelize";
import { PermissionModel, RoleModel } from '../../../authorization/module';
import { BrandModel } from '../../../brand/module';
import { Cart } from '../../../cart/entities/Cart';
import { CartItem } from '../../../cart/entities/CartItem';
import { CartModel } from '../../../cart/module';
import { CategoryModel } from '../../../category/module';
import { IPaymentType } from '../../../payment/interfaces/IPayment';
import { PaymentModel } from '../../../payment/module';
import { Product } from '../../../product/entity/Product';
import { ProductModel } from '../../../product/module';
import { UserModel } from '../../../user/module';
import { OrderItemModel } from '../../model/OrderItemModel';
import { OrderModel } from '../../model/OrderModel';
import { OrderRepository } from '../OrderRepository';
import { Brand } from '../../../brand/entity/Brand';
import { Category } from '../../../category/entity/Category';
import { OrderError } from '../../error/OrderError';

let sequelizeInstance: Sequelize
let repository: OrderRepository
let orderModel: typeof OrderModel
let orderItemModel: typeof OrderItemModel
let productModel: typeof ProductModel
let categoryModel: typeof CategoryModel
let brandModel: typeof BrandModel
let userModel: typeof UserModel
let paymentModel: typeof PaymentModel
let roleModel: typeof RoleModel
let cartModel: typeof CartModel

const PRODUCT_1 = new Product('product-name-1', null, 'product-description-1', 120, true, 1, 1, 1)
const PRODUCT_2 = new Product('product-name-2', null, 'product-description-2', 120, true, 2, 2, 2)
const BRAND_1 = new Brand('test-brand-1', null)
const BRAND_2 = new Brand('test-brand-2', null)
const CATEGORY_1 = new Category('test-category-1')
const CATEGORY_2 = new Category('test-category-1')

beforeAll(async () => {
    sequelizeInstance = new Sequelize(<string>process.env.TEST_DATABASE_URL, {
        logging: false,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        dialect: 'postgres'
    });
    await sequelizeInstance.drop({ cascade: true })
    orderModel = OrderModel.setup(sequelizeInstance)
    productModel = ProductModel.setup(sequelizeInstance)
    categoryModel = CategoryModel.setup(sequelizeInstance)
    brandModel = BrandModel.setup(sequelizeInstance)
    orderItemModel = OrderItemModel.setup(sequelizeInstance)
    userModel = UserModel.setup(sequelizeInstance)
    paymentModel = PaymentModel.setup(sequelizeInstance)
    roleModel = RoleModel.setup(sequelizeInstance)
    cartModel = CartModel.setup(sequelizeInstance)
    orderModel.setupOrderItemAssociation(orderItemModel)
    orderModel.setupPaymentAssociation(paymentModel)
    orderModel.setupUserAssociation(userModel)
    productModel.setupBrandAssociation(brandModel)
    productModel.setupCategoryAssociation(categoryModel)
    orderItemModel.setupOrderAssociation(orderModel)
    orderItemModel.setupProductAssociation(productModel)
    paymentModel.setupOrderAssociation(orderModel)
    userModel.setupRoleAssociation(roleModel)
    repository = new OrderRepository(orderModel)

});

beforeEach(async (done) => {
    await sequelizeInstance.sync({ force: true })
    await roleModel.bulkCreate([
        { name: "ADMIN" },
        { name: "CLIENT" }
    ]);
    await userModel.bulkCreate([
        { mail: 'admin@gmail.com', password: 'admin-password', role_id: 1 },
        { mail: 'client@gmail.com', password: 'client-password', role_id: 2 }
    ])
    await cartModel.bulkCreate([
        { user_id: 1 },
        { user_id: 2 }
    ])
    await brandModel.bulkCreate([BRAND_1, BRAND_2])
    await categoryModel.bulkCreate([CATEGORY_1, CATEGORY_2])
    await productModel.bulkCreate([PRODUCT_1, PRODUCT_2])
    done();
});

afterAll(async () => {
    await sequelizeInstance.close()
});

describe('create', () => {
    it('should create a new order', async () => {
        const CART_ITEM_1 = new CartItem(1, 1, 5, 2, PRODUCT_1)
        const CART_ITEM_2 = new CartItem(2, 2, 3, 2, PRODUCT_2)
        const clientCart = new Cart(1, 2, [CART_ITEM_1, CART_ITEM_2])
        const CLIENT_USER_ID = 2
        const PAYMENT_TYPE: IPaymentType = 'CASH'
        const orderCreated = await repository.create(clientCart, CLIENT_USER_ID, PAYMENT_TYPE)
        expect(orderCreated.user_id).toBe(2)
        expect(orderCreated.orderItems).toHaveLength(2)
        expect(orderCreated.payment?.type).toBe(PAYMENT_TYPE)
    });
    it('should throw if cart is empty', async () => {
        const clientCart = new Cart(1, 2)
        const CLIENT_USER_ID = 2
        const PAYMENT_TYPE: IPaymentType = 'CASH'
        expect.assertions(1)
        try {
            await repository.create(clientCart, CLIENT_USER_ID, PAYMENT_TYPE)
        } catch (err) {
            expect(err).toEqual(OrderError.currentCartEmpty())
        }

    });
});

describe('getOrders', () => {
    it('should retrieve orders', async () => {
        await orderModel.bulkCreate([
            { user_id: 1, },
            { user_id: 2, },
            { user_id: 2, },
            { user_id: 1, },
        ])
        await orderItemModel.bulkCreate([
            { order_id: 1, price_per_unit: 100, product_id: 1, quantity: 5, total: 500 },
            { order_id: 1, price_per_unit: 20, product_id: 2, quantity: 3, total: 60 },
            { order_id: 1, price_per_unit: 40, product_id: 2, quantity: 3, total: 120 },
            { order_id: 2, price_per_unit: 150, product_id: 1, quantity: 2, total: 300 },
            { order_id: 3, price_per_unit: 400, product_id: 2, quantity: 1, total: 400 },
            { order_id: 4, price_per_unit: 210, product_id: 1, quantity: 1, total: 210 },
        ])
        await paymentModel.bulkCreate([
            { amount: 100, order_id: 1, type: 'CASH' },
            { amount: 200, order_id: 2, type: 'CREDIT CARD' },
            { amount: 300, order_id: 3, type: 'CREDIT CARD' },
            { amount: 400, order_id: 4, type: 'CREDIT CARD' },
        ])
        const orders = await repository.getAll()
        expect(orders.count).toBe(4)
        expect(orders.results).toHaveLength(4)
        expect(orders.results[3].user_id).toBe(1)
        expect(orders.results[3].payment?.amount).toBe(400)
        expect(orders.results[3].orderItems).toHaveLength(1)
    });
});