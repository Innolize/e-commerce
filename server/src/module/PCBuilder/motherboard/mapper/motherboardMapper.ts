import { FullMotherboard } from "../entity/FullMotherboard"
import { MotherboardModel } from "../model/motherboardModel"

export const fromDbToFullMotherboard = (model: MotherboardModel): FullMotherboard => {
    return new FullMotherboard(model.toJSON() as FullMotherboard)
}