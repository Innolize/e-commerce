import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractRepository } from "../../../abstractClasses/abstractRepository";
import { Sequelize } from "sequelize";
import { ProductModel } from "../../../product/module";
import { Product } from "../../../product/entity/Product";
import { FullDiskStorage } from "../entities/FullDiskStorage";
import { DiskStorageModel } from "../model/DiskStorageModel";
import { fromDbToDiskStorage, fromDbToFullDiskStorage } from "../mapper/diskStorageMapper";
import { IDiskStorageQuery } from "../interface/IDiskStorageQuery";
import { DiskStorage } from "../entities/DiskStorage";

@injectable()
export class DiskStorageRepository extends AbstractRepository {
    private diskStorageModel: typeof DiskStorageModel
    private productModel: typeof ProductModel
    private ORM: Sequelize

    constructor(
        @inject(TYPES.PCBuilder.DiskStorage.Model) diskStorageModel: typeof DiskStorageModel,
        @inject(TYPES.Common.Database) ORM: Sequelize,
        @inject(TYPES.Product.Model) productModel: typeof ProductModel
    ) {
        super()
        this.diskStorageModel = diskStorageModel
        this.productModel = productModel
        this.ORM = ORM
    }

    async getDisks(query?: IDiskStorageQuery): Promise<FullDiskStorage[]> {
        const queryParams: {
            type?: unknown,
        } = {}
        if (query?.type) {
            queryParams.type = query.type
        }
        console.log(queryParams)
        const response = await this.diskStorageModel.findAll({ where: queryParams, include: "product" });
        return response.map(fromDbToFullDiskStorage)
    }

    async getSingleDisk(id: number): Promise<FullDiskStorage | Error> {
        try {
            const response = await this.diskStorageModel.findByPk(id, { include: 'product' })
            if (!response) {
                throw new Error('Disk storage not found')
            }
            const disk = fromDbToFullDiskStorage(response)
            return disk
        } catch (err) {
            throw new Error(err.message)
        }


    }

    async createDisk(product: Product, diskStorage: DiskStorage): Promise<FullDiskStorage | Error> {
        const transaction = await this.ORM.transaction()
        try {
            const newProduct = await this.productModel.create(product, { transaction, isNewRecord: true });
            const id_product = newProduct.getDataValue("id")
            const newDiskStorage = new DiskStorage({ ...diskStorage, id_product })
            const createdDiskStorage = await this.diskStorageModel.create(newDiskStorage, { transaction, isNewRecord: true, include: "product" })
            transaction.commit()
            const response = fromDbToFullDiskStorage(createdDiskStorage)
            return response
        } catch (err) {
            throw new Error(err.message)
        }
    }

    async modifyDisk(id: number, diskStorage: DiskStorage): Promise<DiskStorage | Error> {
        try {
            const [diskEdited, diskArray] = await this.diskStorageModel.update(diskStorage, { where: { id }, returning: true })
            // update returns an array, first argument is the number of elements updated in the
            // database. Second argument are the array of elements. Im updating by id so there is only 
            // one element in the array.
            if (!diskEdited) {
                throw new Error('Ram not found')
            }
            const modifiedDisk = diskArray[0]
            return fromDbToDiskStorage(modifiedDisk)
        } catch (err) {
            throw new Error(err.message)
        }
    }

    async deleteDisk(id: number): Promise<true | Error> {

        try {
            const response = await this.diskStorageModel.destroy({ where: { id } })
            if (!response) {
                throw new Error('Disk storage not found')
            }
            return true
        } catch (err) {
            throw new Error(err.message)
        }
    }
}