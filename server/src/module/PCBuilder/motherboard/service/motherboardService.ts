import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractService } from "../../../abstractClasses/abstractService";
import { Product } from "../../../product/entity/Product";
import { FullMotherboard } from "../entity/FullMotherboard";
import { Motherboard } from "../entity/Motherboard";
import { IMotherboard } from "../interface/IMotherboard";
import { MotherboardRepository } from "../repository/motherboardRepository";

@injectable()
export class MotherboardService extends AbstractService {
    private motherboardRepository: MotherboardRepository;
    constructor(
        @inject(TYPES.PCBuilder.Motherboard.Repository) motherboardRepository: MotherboardRepository
    ) {
        super()
        this.motherboardRepository = motherboardRepository
    }

    getMotherboards(): Promise<IMotherboard[]> {
        return this.motherboardRepository.getAll()
    }

    async createMotherboard(product: Product, motherboard: Motherboard): Promise<FullMotherboard | Error> {
        return await this.motherboardRepository.createMotherboard(product, motherboard)
    }
}