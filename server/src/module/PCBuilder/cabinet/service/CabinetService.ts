import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractService } from "../../../abstractClasses/abstractService";
import { Product } from "../../../product/entity/Product";
import { Cabinet } from "../entities/Cabinet";
import { ICabinetEdit } from "../interface/ICabinetEdit";
import { ICabinetQuery } from "../interface/ICabinetQuery";
import { CabinetRepository } from "../repository/CabinetRepository";

@injectable()
export class CabinetService extends AbstractService {
    private cabinetRepository: CabinetRepository
    constructor(
        @inject(TYPES.PCBuilder.Cabinet.Repository) cabinetRepository: CabinetRepository
    ) {
        super()
        this.cabinetRepository = cabinetRepository
    }

    async getCabinets(query?: ICabinetQuery): Promise<Cabinet[]> {
        return await this.cabinetRepository.getCabinets(query)
    }

    async getSingleCabinet(id: number): Promise<Cabinet | Error> {
        return await this.cabinetRepository.getSingleCabinet(id)
    }

    async createCabinet(product: Product, cabinet: Cabinet): Promise<Cabinet | Error> {
        return await this.cabinetRepository.createCabinet(product, cabinet)
    }

    async modifyCabinet(id: number, cabinet: ICabinetEdit): Promise<Cabinet | Error> {
        return await this.cabinetRepository.modifyCabinet(id, cabinet)
    }
    async deleteCabinet(id: number): Promise<true | Error> {
        return await this.cabinetRepository.deleteCabinet(id)
    }
}