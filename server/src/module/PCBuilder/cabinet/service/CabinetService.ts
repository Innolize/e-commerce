import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractService } from "../../../abstractClasses/abstractService";
import { Product } from "../../../product/entity/Product";
import { GetCabinetsDto } from "../dto/getCabinetsDto";
import { GetCabinetsReqDto } from "../dto/getCabinetsReqDto";
import { Cabinet } from "../entities/Cabinet";
import { ICabinetProductless } from "../interface/ICabinetCreate";
import { ICabinetEdit } from "../interface/ICabinetEdit";
import { ICabinetRepository } from "../interface/ICabinetRepository";
import { ICabinetService } from "../interface/ICabinetService";

@injectable()
export class CabinetService extends AbstractService implements ICabinetService {
    private cabinetRepository: ICabinetRepository
    constructor(
        @inject(TYPES.PCBuilder.Cabinet.Repository) cabinetRepository: ICabinetRepository
    ) {
        super()
        this.cabinetRepository = cabinetRepository
    }

    async getCabinets(query: GetCabinetsReqDto): Promise<GetCabinetsDto> {
        return await this.cabinetRepository.getCabinets(query)
    }

    async getSingleCabinet(id: number): Promise<Cabinet> {
        return await this.cabinetRepository.getSingleCabinet(id)
    }

    async createCabinet(product: Product, cabinet: ICabinetProductless): Promise<Cabinet> {
        return await this.cabinetRepository.createCabinet(product, cabinet)
    }

    async modifyCabinet(id: number, cabinet: ICabinetEdit): Promise<Cabinet> {
        return await this.cabinetRepository.modifyCabinet(id, cabinet)
    }
    async deleteCabinet(id: number): Promise<true> {
        return await this.cabinetRepository.deleteCabinet(id)
    }
}