import { decorate, injectable } from "inversify";
import { Association, DataTypes, Sequelize, HasManyGetAssociationsMixin, HasOneGetAssociationMixin } from "sequelize";
import { Model } from "sequelize";
import { CategoryModel } from "../../category/module";
import { IProduct } from "../interfaces/IProduct";
import { BrandModel } from "../../brand/module";
import { IProductCreate } from "../interfaces/IProductCreate";
import { Product } from "../entity/Product";
import { Category } from "../../category/entity/Category";
import { Brand } from "../../brand/entity/Brand";
import { CartItemModel } from "../../cart/module";
import { DiskStorageModel } from "../../PCBuilder/disk-storage/module";
import { CabinetModel } from "../../PCBuilder/cabinet/module";
import { MotherboardModel } from "../../PCBuilder/motherboard/module";
import { PowerSupplyModel } from "../../PCBuilder/power-supply/module";
import { ProcessorModel } from "../../PCBuilder/processor/module";
import { RamModel } from "../../PCBuilder/ram/module";
import { VideoCardModel } from "../../PCBuilder/video-card/module";

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

    public getCartItems!: HasManyGetAssociationsMixin<CartItemModel>;
    public getCabinet!: HasOneGetAssociationMixin<CabinetModel>;
    public getDiskStorage!: HasOneGetAssociationMixin<DiskStorageModel>;
    public getMotherboard!: HasOneGetAssociationMixin<MotherboardModel>;
    public getPowerSupply!: HasOneGetAssociationMixin<PowerSupplyModel>;
    public getProcessor!: HasOneGetAssociationMixin<ProcessorModel>;
    public getRam!: HasOneGetAssociationMixin<RamModel>;
    public getVideoCard!: HasOneGetAssociationMixin<VideoCardModel>;

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
            onDelete: "cascade"
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

    static setupPCBuilderAssociation(
        diskStorageModel: typeof DiskStorageModel,
        cabinetModel: typeof CabinetModel,
        motherboardModel: typeof MotherboardModel,
        powerSupplyModel: typeof PowerSupplyModel,
        processorModel: typeof ProcessorModel,
        ramModel: typeof RamModel,
        videoCard: typeof VideoCardModel

    ): void {
        this.setupDiskStorageAssociation(diskStorageModel)
        this.setupCabinetAssociation(cabinetModel)
        this.setupMotherboardAssociation(motherboardModel)
        this.setupPowerSupplyAssociation(powerSupplyModel)
        this.setupProcessorAssociation(processorModel)
        this.setupRamAssociation(ramModel)
        this.setupVideoCardAssociation(videoCard)
    }
    static setupDiskStorageAssociation(model: typeof DiskStorageModel): void {
        ProductModel.hasOne(model, {
            as: 'DiskStorage',
            onDelete: 'CASCADE',
            foreignKey: "id_product",
        })
    }

    static setupCabinetAssociation(model: typeof CabinetModel): void {
        ProductModel.hasOne(model, {
            as: 'Cabinet',
            onDelete: 'CASCADE',
            foreignKey: {
                name: "id_product",
                allowNull: false
            },
        })
    }

    static setupMotherboardAssociation(model: typeof MotherboardModel): void {
        ProductModel.hasOne(model, {
            as: 'Motherboard',
            onDelete: 'CASCADE',
            foreignKey: {
                name: "id_product",
                allowNull: false
            },
        })
    }

    static setupPowerSupplyAssociation(model: typeof PowerSupplyModel): void {
        ProductModel.hasOne(model, {
            as: 'PowerSupply',
            onDelete: 'CASCADE',
            foreignKey: {
                name: "id_product",
                allowNull: false
            },
        })
    }


    static setupProcessorAssociation(model: typeof ProcessorModel): void {
        ProductModel.hasOne(model, {
            as: 'Processor',
            onDelete: 'CASCADE',
            foreignKey: {
                name: "id_product",
                allowNull: false
            },
        })
    }

    static setupRamAssociation(model: typeof RamModel): void {
        ProductModel.hasOne(model, {
            as: 'Ram',
            onDelete: 'CASCADE',
            foreignKey: {
                name: "id_product",
                allowNull: false
            },
        })
    }

    static setupVideoCardAssociation(model: typeof VideoCardModel): void {
        ProductModel.hasOne(model, {
            as: 'VideoCard',
            onDelete: 'CASCADE',
            foreignKey: {
                name: "id_product",
                allowNull: false
            },
        })
    }

    static setPCBuilderOnDeleteHook(productModel: typeof ProductModel): void {
        this.addCabinetHookOnDelete(productModel)
        DiskStorageModel.addDiskStorageHookOnDelete(productModel)
        MotherboardModel.addMotherboardHookOnDelete(productModel)
        PowerSupplyModel.addPowerSupplyHookOnDelete(productModel)
        ProcessorModel.addProcessorHookOnDelete(productModel)
        RamModel.addRamHookOnDelete(productModel)
        this.addVideoCardHookOnDelete(productModel)
    }

    private static addCabinetHookOnDelete(productModel: typeof ProductModel) {
        productModel.addHook('afterDestroy', 'cabinetHookOnDelete',
            async (instance: ProductModel) => {
                const cabinet = await instance.getCabinet()
                if (cabinet) {
                    await cabinet.destroy()
                    console.log(`Cabinet associated with product ${instance.id} deleted`)
                }
            })
    }



    public static associations: {
        category: Association<ProductModel, CategoryModel>,
        brand: Association<ProductModel, CategoryModel>,
        cartItems: Association<ProductModel, CartItemModel>,
        cabinet: Association<ProductModel, CabinetModel>
        disk: Association<ProductModel, DiskStorageModel>
        motherboard: Association<ProductModel, MotherboardModel>
        powerSupply: Association<ProductModel, PowerSupplyModel>
        processor: Association<ProductModel, ProcessorModel>
        ram: Association<ProductModel, RamModel>
        videoCard: Association<ProductModel, VideoCardModel>
    }
}