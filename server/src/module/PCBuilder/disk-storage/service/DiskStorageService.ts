import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractService } from "../../../abstractClasses/abstractService";
import { Product } from "../../../product/entity/Product";
import { GetDiskStorageDto } from "../dto/getDiskStorageDto";
import { GetDiskStorageReqDto } from "../dto/getDiskStorageReqDto";
import { DiskStorage } from "../entities/DiskStorage";
import { DiskStorageRepository } from "../repository/DiskStorageRepository";

@injectable()
export class DiskStorageService extends AbstractService {
    private diskStorageRepository: DiskStorageRepository
    constructor(
        @inject(TYPES.PCBuilder.DiskStorage.Repository) diskStorageRepository: DiskStorageRepository
    ) {
        super()
        this.diskStorageRepository = diskStorageRepository
    }

    async getDisks(query: GetDiskStorageReqDto): Promise<GetDiskStorageDto> {
        return await this.diskStorageRepository.getDisks(query)
    }

    async getSingleDisk(id: number): Promise<DiskStorage | Error> {
        return await this.diskStorageRepository.getSingleDisk(id)
    }

    async createDisk(product: Product, disk: DiskStorage): Promise<DiskStorage | Error> {
        return await this.diskStorageRepository.createDisk(product, disk)
    }

    async modifyDisk(id: number, disk: DiskStorage): Promise<DiskStorage | Error> {
        return await this.diskStorageRepository.modifyDisk(id, disk)
    }
    async deleteDisk(id: number): Promise<true | Error> {
        return await this.diskStorageRepository.deleteDisk(id)
    }
}