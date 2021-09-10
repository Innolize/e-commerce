import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractService } from "../../../abstractClasses/abstractService";
import { Product } from "../../../product/entity/Product";
import { GetDiskStorageDto } from "../dto/getDiskStorageDto";
import { GetDiskStorageReqDto } from "../dto/getDiskStorageReqDto";
import { DiskStorage } from "../entities/DiskStorage";
import { IDiskStorageRepository } from "../interface/IDiskStorageRepository";
import { IDiskStorageService } from "../interface/IDiskStorageService";

@injectable()
export class DiskStorageService extends AbstractService implements IDiskStorageService {

    constructor(
        @inject(TYPES.PCBuilder.DiskStorage.Repository) private diskStorageRepository: IDiskStorageRepository
    ) {
        super()
        this.diskStorageRepository = diskStorageRepository
    }

    async getDisks(query: GetDiskStorageReqDto): Promise<GetDiskStorageDto> {
        return await this.diskStorageRepository.getDisks(query)
    }

    async getSingleDisk(id: number): Promise<DiskStorage> {
        return await this.diskStorageRepository.getSingleDisk(id)
    }

    async createDisk(product: Product, disk: DiskStorage): Promise<DiskStorage> {
        return await this.diskStorageRepository.createDisk(product, disk)
    }

    async modifyDisk(id: number, disk: DiskStorage): Promise<DiskStorage> {
        return await this.diskStorageRepository.modifyDisk(id, disk)
    }
    async deleteDisk(id: number): Promise<true> {
        return await this.diskStorageRepository.deleteDisk(id)
    }
}