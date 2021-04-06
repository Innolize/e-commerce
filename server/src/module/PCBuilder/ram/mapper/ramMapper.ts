import { FullRam } from "../entities/FullRam"
import { Ram } from "../entities/Ram"
import { RamModel } from "../model/ramModel"
import { IRamCreate } from '../interface/IRamCreate'

export const fromDbToFullRam = (model: RamModel): FullRam => {
    return new FullRam(model.toJSON() as FullRam)
}

export const fromDbToRam = (model: RamModel): Ram => {
    return new Ram(model.toJSON() as IRamCreate)
}