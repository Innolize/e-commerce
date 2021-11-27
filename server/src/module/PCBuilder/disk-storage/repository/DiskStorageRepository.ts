import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractRepository } from "../../../abstractClasses/abstractRepository";
import { WhereOptions } from "sequelize";
import { ProductModel } from "../../../product/module";
import { DiskStorageModel } from "../model/DiskStorageModel";
import { fromDbToDiskStorage } from "../mapper/diskStorageMapper";
import { DiskStorage } from "../entities/DiskStorage";
import { DiskStorageError } from "../error/DiskStorageError";
import { GetDiskStorageReqDto } from "../dto/getDiskStorageReqDto"
import { GetDiskStorageDto } from "../dto/getDiskStorageDto"
import { IDiskStorageRepository } from "../interface/IDiskStorageRepository";
import { IDiskStorageEdit } from "../interface/IDiskStorageEdit";
import { IDiskStorageCreate } from "../interface/IDiskStorageCreate";

@injectable()
export class DiskStorageRepository extends AbstractRepository implements IDiskStorageRepository {
    constructor(
        @inject(TYPES.PCBuilder.DiskStorage.Model) private diskStorageModel: typeof DiskStorageModel,
    ) {
        super()
        this.diskStorageModel = diskStorageModel
    }

    async getDisks(queryParams: GetDiskStorageReqDto): Promise<GetDiskStorageDto> {
        const { limit, offset, type } = queryParams
        const whereOptions: WhereOptions<DiskStorage> = {}
        type ? whereOptions.type = type : ''
        const { rows, count } = await this.diskStorageModel.findAndCountAll({ where: whereOptions, limit, offset, include: { association: DiskStorageModel.associations.product, include: [{ association: ProductModel.associations.brand }, { association: ProductModel.associations.category }] } });
        const disks = rows.map(fromDbToDiskStorage)
        const response = new GetDiskStorageDto(count, disks)
        return response
    }

    async getSingleDisk(id: number): Promise<DiskStorage> {
        const response = await this.diskStorageModel.findByPk(id, { include: { association: DiskStorageModel.associations.product, include: [{ association: ProductModel.associations.brand }, { association: ProductModel.associations.category }] } })
        if (!response) {
            throw DiskStorageError.notFound()
        }
        const disk = fromDbToDiskStorage(response)
        return disk
    }

    async createDisk(newDiskStorage: IDiskStorageCreate): Promise<DiskStorage> {
        const newDisk = await this.diskStorageModel.create(newDiskStorage, { include: DiskStorageModel.associations.product })
        const response = fromDbToDiskStorage(newDisk)
        return response

    }

    async modifyDisk(id: number, diskStorage: IDiskStorageEdit): Promise<DiskStorage> {
        const [diskEdited, diskArray] = await this.diskStorageModel.update(diskStorage, { where: { id }, returning: true })
        // update returns an array, first argument is the number of elements updated in the
        // database. Second argument are the array of elements. Im updating by id so there is only 
        // one element in the array.
        if (!diskEdited) {
            throw DiskStorageError.notFound()
        }
        const modifiedDisk = diskArray[0]
        return fromDbToDiskStorage(modifiedDisk)
    }

    async deleteDisk(id: number): Promise<true> {
        const response = await this.diskStorageModel.destroy({ where: { id } })
        if (!response) {
            throw DiskStorageError.notFound()
        }
        return true
    }
}