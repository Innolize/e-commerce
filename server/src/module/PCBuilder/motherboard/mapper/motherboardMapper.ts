import { FullMotherboard } from "../entity/FullMotherboard"
import { Motherboard } from "../entity/Motherboard"
import { IMotherboard } from "../interface/IMotherboard"
import { IMotherboardCreate } from "../interface/IMotherboardCreate"
import { MotherboardModel } from "../model/motherboardModel"

export const fromDbToFullMotherboard = (model: MotherboardModel): FullMotherboard => {
    return new FullMotherboard(model.toJSON() as IMotherboard)
}

export const fromDbToMotherboard = (model: MotherboardModel): Motherboard => {
    return new Motherboard(model.toJSON() as IMotherboardCreate)
}