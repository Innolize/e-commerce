import { FullMotherboard } from "../entity/FullMotherboard"
import { Motherboard } from "../entity/Motherboard"
import { MotherboardModel } from "../model/motherboardModel"

export const fromDbToFullMotherboard = (model: MotherboardModel): FullMotherboard => {
    return new FullMotherboard(model.toJSON() as FullMotherboard)
}

export const fromDbToMotherboard = (model: MotherboardModel): Motherboard =>{
    return new Motherboard(model.toJSON() as Motherboard)
}