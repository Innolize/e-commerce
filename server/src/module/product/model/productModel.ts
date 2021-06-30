import { decorate, injectable } from "inversify";
import { Association, DataTypes, Sequelize, HasManyGetAssociationsMixin } from "sequelize";
import { Model } from "sequelize";
import { CategoryModel } from "../../category/module";
import { IProduct } from "../interfaces/IProduct";
import { BrandModel } from "../../brand/module";
import { IProductCreate } from "../interfaces/IProductCreate";
import { Product } from "../entity/Product";
import { Category } from "../../category/entity/Category";
import { Brand } from "../../brand/entity/Brand";
import { CartItemModel } from "../../cart/module";

decorate(injectable(), (Model))

@injectable()
export class ProductModel extends Model<Product, IProductCreate> implements IProduct {

    id?: number | undefined;
    name: string;
    image: string | null;
    description: string | null;
    price: number;
    stock: boolean;
    id_category: number;
    id_brand: number;
    category?: Category | undefined;
    brand?: Brand | undefined;

    static setup(database: Sequelize): typeof ProductModel {
        ProductModel.init({
            id: {
                primaryKey: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [3, 40]
                }
            },
            image: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    len: [3, 100]
                }
            },
            price: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            stock: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            },
            id_brand: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            id_category: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
            {
                sequelize: database,
                paranoid: true,
                modelName: "Product",
                hooks: {
                    beforeBulkDestroy: function (options) {
                        options.individualHooks = true;
                    },
                    afterDestroy: async (instance) => {
                        const cartItemModels = await instance.getCartItems()
                        cartItemModels.map(async (cartItem) => await cartItem.destroy())
                        console.log(`Cart items associated with product ${instance.id} deleted`)
                    }
                }
            })
        return ProductModel
    }

    public getCartItems!: HasManyGetAssociationsMixin<CartItemModel>

    static setupCategoryAssociation(model: typeof CategoryModel): void {
        ProductModel.belongsTo(model, {
            as: "category",
            foreignKey: "id_category",
            onDelete: "cascade"
        })
    }
    static setupBrandAssociation(model: typeof BrandModel): void {
        ProductModel.belongsTo(model, {
            as: "brand",
            foreignKey: "id_brand",
        })
    }

    static setupCartItemAssociation(model: typeof CartItemModel): void {
        ProductModel.hasMany(model, {
            as: "cartItems",
            foreignKey: "product_id",
            hooks: true,
            onDelete: "CASCADE"
        })
    }

    public static associations: {
        category: Association<ProductModel, CategoryModel>,
        brand: Association<ProductModel, CategoryModel>,
        cartItems: Association<ProductModel, CartItemModel>
    }
}
