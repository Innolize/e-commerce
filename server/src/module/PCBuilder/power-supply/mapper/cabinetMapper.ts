import { FullPowerSupply } from "../entities/FullPowerSupply"
import { PowerSupply } from "../entities/PowerSupply"
import { PowerSupplyModel } from "../model/PowerSupplyModel"
import { IPowerSupplyCreate } from '../interface/IPowerSupplyCreate'

export const fromDbToFullPowerSupply = (model: PowerSupplyModel): FullPowerSupply => {
    return new FullPowerSupply(model.toJSON() as FullPowerSupply)
}

export const fromDbToPowerSupply = (model: PowerSupplyModel): PowerSupply => {
    return new PowerSupply(model.toJSON() as IPowerSupplyCreate)
}